<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WeaponHibahTransferRequest;

class WeaponHibahTransferRequestPolicy
{
    /**
     * Determine whether the user can view any hibah transfer requests.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view list
        return true;
    }

    /**
     * Determine whether the user can view the hibah transfer request.
     */
    public function view(User $user, WeaponHibahTransferRequest $transfer): bool
    {
        // All authenticated users can view details
        return true;
    }

    /**
     * Determine whether the user can create hibah transfer requests.
     */
    public function create(User $user): bool
    {
        // Users with permission can create
        return $user->can('create_hibah_transfer');
    }

    /**
     * Determine whether the user can submit the draft hibah transfer request.
     */
    public function submit(User $user, WeaponHibahTransferRequest $transfer): bool
    {
        // Only creator can submit, and only if status is draft
        return $transfer->status === 'draft' 
            && ($transfer->created_by === $user->id || $user->can('manage_hibah_transfer'));
    }

    /**
     * Determine whether the user can approve/reject the hibah transfer request.
     */
    public function approve(User $user, WeaponHibahTransferRequest $transfer): bool
    {
        // Only users with approval permission can approve/reject
        // Status must be pending
        return $transfer->status === 'pending' 
            && $user->can('approve_hibah_transfer');
    }

    /**
     * Determine whether the user can delete the hibah transfer request.
     */
    public function delete(User $user, WeaponHibahTransferRequest $transfer): bool
    {
        // Only creator can delete, and only if status is draft or rejected
        return in_array($transfer->status, ['draft', 'rejected'])
            && ($transfer->created_by === $user->id || $user->can('manage_hibah_transfer'));
    }
}
