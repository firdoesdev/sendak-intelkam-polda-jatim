<?php

namespace App\Actions\Weapons;

use App\Models\WeaponHibahTransferRequest;
use App\Models\WeaponOwnershipHistory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ApproveWeaponHibahTransfer
{
    public function approve(WeaponHibahTransferRequest $request, ?string $notes = null): void
    {
        DB::transaction(function () use ($request, $notes) {
            // Generate request number
            $year = now()->year;
            $month = now()->format('m');
            $sequence = str_pad(
                WeaponHibahTransferRequest::where('status', 'approved')
                    ->whereYear('approved_at', $year)
                    ->whereMonth('approved_at', now()->month)
                    ->count() + 1,
                4,
                '0',
                STR_PAD_LEFT
            );
            $requestNumber = "HIBAH-{$year}{$month}-{$sequence}";

            // Update transfer request
            $request->update([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => Auth::id(),
                'approval_notes' => $notes,
                'request_number' => $requestNumber,
            ]);

            // Close previous ownership history
            WeaponOwnershipHistory::where('weapon_id', $request->weapon_id)
                ->whereNull('owned_to')
                ->update(['owned_to' => now()]);

            // Create new ownership history
            WeaponOwnershipHistory::create([
                'weapon_id' => $request->weapon_id,
                'owner_person_id' => $request->to_person_id,
                'permit_id' => $request->to_permit_id,
                'owned_from' => now(),
                'transfer_type' => 'hibah',
                'notes' => "Transfer via request {$requestNumber}",
            ]);

            // Update weapon acquisition info
            $request->weapon->update([
                'acquisition_type' => 'hibah',
                'previous_owner_id' => $request->from_person_id,
                'previous_owner_permit_id' => $request->from_permit_id,
                'transfer_date' => now(),
            ]);
        });
    }

    public function reject(WeaponHibahTransferRequest $request, string $reason): void
    {
        $request->update([
            'status' => 'rejected',
            'approved_at' => now(),
            'approved_by' => Auth::id(),
            'approval_notes' => $reason,
        ]);
    }
}
