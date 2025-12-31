<?php

namespace App\Actions\PermitRenewals;

use App\Models\Permit;
use App\Models\PermitRenewal;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class RequestPermitRenewal
{
    public function execute(array $data): PermitRenewal
    {
        // 1. Load permit with validation
        $permit = Permit::findOrFail($data['permit_id']);
        
        // 2. Business Rule: Permit must be APPROVED
        if ($permit->status !== 'approved') {
            throw ValidationException::withMessages([
                'permit_id' => 'Izin harus dalam status disetujui untuk dapat diperpanjang.',
            ]);
        }
        
        // 3. Business Rule: Check for duplicate pending/draft renewals
        $existingRenewal = PermitRenewal::where('permit_id', $permit->id)
            ->whereIn('status', ['draft', 'pending'])
            ->exists();
            
        if ($existingRenewal) {
            throw ValidationException::withMessages([
                'permit_id' => 'Sudah ada permintaan perpanjangan yang sedang diproses untuk izin ini.',
            ]);
        }
        
        // 4. Business Rule: Can only renew within 60 days before expiry
        $daysUntilExpiry = Carbon::parse($permit->valid_to)->diffInDays(now(), false);
        if ($daysUntilExpiry < -60) {
            throw ValidationException::withMessages([
                'permit_id' => 'Perpanjangan izin hanya dapat diajukan dalam 60 hari sebelum masa berlaku habis.',
            ]);
        }
        
        // 5. Business Rule: Max extension period is 1 year
        $currentValidTo = Carbon::parse($data['current_valid_to']);
        $newValidTo = Carbon::parse($data['new_valid_to']);
        $extensionMonths = $currentValidTo->diffInMonths($newValidTo);
        
        if ($extensionMonths > 12) {
            throw ValidationException::withMessages([
                'new_valid_to' => 'Perpanjangan izin maksimal 1 tahun dari masa berlaku saat ini.',
            ]);
        }
        
        // Auto-populate fields
        $data['requested_by'] = Auth::id();
        $data['status'] = $data['status'] ?? 'draft';
        
        if ($data['status'] === 'pending') {
            $data['submitted_at'] = now();
        }
        
        $renewal = PermitRenewal::create($data);
        
        // TODO: Send notification to approvers
        // Notification::send($approvers, new PermitRenewalRequested($renewal));
        
        return $renewal;
    }
}
