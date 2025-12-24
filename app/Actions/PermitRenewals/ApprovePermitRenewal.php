<?php

namespace App\Actions\PermitRenewals;

use App\Models\PermitRenewal;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ApprovePermitRenewal
{
    public function execute(int $id, ?string $rejectionReason = null): PermitRenewal
    {
        return DB::transaction(function () use ($id, $rejectionReason) {
            $renewal = PermitRenewal::with('permit')->findOrFail($id);
            
            if ($renewal->status !== 'pending') {
                throw new \Exception('Hanya renewal request dengan status pending yang dapat disetujui.');
            }
            
            $isApproved = is_null($rejectionReason);
            
            $renewal->update([
                'status' => $isApproved ? 'approved' : 'rejected',
                'approved_by' => Auth::id(),
                'approved_at' => now(),
                'rejection_reason' => $rejectionReason,
            ]);
            
            if ($isApproved) {
                // Generate renewal number on approval
                if (empty($renewal->renewal_number)) {
                    $renewal->update([
                        'renewal_number' => $this->generateRenewalNumber($renewal),
                    ]);
                }
                
                // Update permit's valid_to date and reset notification tracking
                $renewal->permit->update([
                    'valid_to' => $renewal->new_valid_to,
                    'last_notified_at' => null,
                    'notification_count' => 0,
                ]);
            }
            
            // TODO: Send notification to requester
            // Notification::send($renewal->requester, new PermitRenewalProcessed($renewal));
            
            return $renewal->fresh();
        });
    }
    
    private function generateRenewalNumber(PermitRenewal $renewal): string
    {
        // Format: RNW-[YEAR][MONTH]-[SEQUENTIAL]
        // Example: RNW-202512-0001
        $year = now()->format('Y');
        $month = now()->format('m');
        $prefix = 'RNW';
        
        $lastRenewal = PermitRenewal::whereYear('approved_at', $year)
            ->whereMonth('approved_at', $month)
            ->whereNotNull('renewal_number')
            ->orderBy('renewal_number', 'desc')
            ->first();
        
        $sequence = 1;
        if ($lastRenewal && $lastRenewal->renewal_number) {
            $lastSequence = (int) substr($lastRenewal->renewal_number, -4);
            $sequence = $lastSequence + 1;
        }
        
        return sprintf('%s-%s%s-%04d', $prefix, $year, $month, $sequence);
    }
}
