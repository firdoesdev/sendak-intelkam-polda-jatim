<?php

namespace App\Actions\Weapons;

use App\Models\WeaponTransferRequest;
use App\Models\WeaponMovement;
use App\Models\Weapon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ApproveTransferWeapon
{
    public function execute(int $id, ?string $rejectionReason = null): WeaponTransferRequest
    {
        return DB::transaction(function () use ($id, $rejectionReason) {
            $transferRequest = WeaponTransferRequest::with('weapon')->findOrFail($id);
            
            if ($transferRequest->status !== 'pending') {
                throw new \Exception('Hanya transfer request dengan status pending yang dapat disetujui.');
            }
            
            $isApproved = is_null($rejectionReason);
            
            $transferRequest->update([
                'status' => $isApproved ? 'approved' : 'rejected',
                'approved_by' => Auth::id(),
                'approved_at' => now(),
                'rejection_reason' => $rejectionReason,
            ]);
            
            if ($isApproved) {
                // Generate request number on approval
                if (empty($transferRequest->request_number)) {
                    $transferRequest->update([
                        'request_number' => $this->generateRequestNumber($transferRequest),
                    ]);
                }
                
                // Update weapon's warehouse
                $transferRequest->weapon->update([
                    'warehouse_id' => $transferRequest->to_warehouse_id,
                ]);
                
                // Create movement record
                WeaponMovement::create([
                    'weapon_id' => $transferRequest->weapon_id,
                    'movement_type' => 'transfer',
                    'from_warehouse_id' => $transferRequest->from_warehouse_id,
                    'to_warehouse_id' => $transferRequest->to_warehouse_id,
                    'moved_by' => Auth::id(),
                    'moved_at' => now(),
                    'notes' => "Transfer approved via request #{$transferRequest->request_number}",
                ]);
            }
            
            // TODO: Send notification to requester
            // Notification::send($transferRequest->requester, new TransferRequestProcessed($transferRequest));
            
            return $transferRequest->fresh();
        });
    }
    
    private function generateRequestNumber(WeaponTransferRequest $transferRequest): string
    {
        // Format: TRF-[YEAR][MONTH]-[SEQUENTIAL]
        // Example: TRF-202512-0001
        $year = now()->format('Y');
        $month = now()->format('m');
        $prefix = 'TRF';
        
        $lastRequest = WeaponTransferRequest::whereYear('approved_at', $year)
            ->whereMonth('approved_at', $month)
            ->whereNotNull('request_number')
            ->orderBy('request_number', 'desc')
            ->first();
        
        $sequence = 1;
        if ($lastRequest && $lastRequest->request_number) {
            $lastSequence = (int) substr($lastRequest->request_number, -4);
            $sequence = $lastSequence + 1;
        }
        
        return sprintf('%s-%s%s-%04d', $prefix, $year, $month, $sequence);
    }
}
