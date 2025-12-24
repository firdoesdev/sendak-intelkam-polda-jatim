<?php

namespace App\Actions\PermitRenewals;

use App\Models\PermitRenewal;
use Illuminate\Support\Facades\Auth;

class RequestPermitRenewal
{
    public function execute(array $data): PermitRenewal
    {
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
