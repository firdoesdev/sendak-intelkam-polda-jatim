<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WeaponTransferRequest;
use Illuminate\Auth\Access\HandlesAuthorization;

class WeaponTransferRequestPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('view-weapons');
    }

    public function approve(User $user, WeaponTransferRequest $transfer): bool
    {
        return $transfer->status === 'pending'
            && $user->can('approve-transfer-requests');
    }
}
