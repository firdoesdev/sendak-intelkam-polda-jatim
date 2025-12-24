<?php

namespace App\Actions\Weapons;

use App\Models\WeaponTransferRequest;
use Illuminate\Support\Facades\Auth;

class RequestTransferWeapon
{
    public function execute(array $data): WeaponTransferRequest
    {
        $data['requested_by'] = Auth::id();
        $data['status'] = $data['status'] ?? 'draft';
        
        if ($data['status'] === 'pending') {
            $data['submitted_at'] = now();
        }
        
        $transferRequest = WeaponTransferRequest::create($data);
        
        // TODO: Send notification to approvers
        // Notification::send($approvers, new TransferRequestCreated($transferRequest));
        
        return $transferRequest;
    }
}
