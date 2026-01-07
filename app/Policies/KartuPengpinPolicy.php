<?php

namespace App\Policies;

use App\Models\User;
use App\Models\KartuPengpin;

class KartuPengpinPolicy
{
    /**
     * Determine whether the user can view any kartu pengpin.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view list
        return true;
    }

    /**
     * Determine whether the user can view the kartu pengpin.
     */
    public function view(User $user, KartuPengpin $kartu): bool
    {
        // All authenticated users can view details
        return true;
    }

    /**
     * Determine whether the user can create kartu pengpin.
     */
    public function create(User $user): bool
    {
        // Users with permission can create
        // TODO
        return $user->can('create_kartu_pengpin');
    }

    /**
     * Determine whether the user can print the kartu pengpin.
     */
    public function print(User $user, KartuPengpin $kartu): bool
    {
        // Can print if card is active
        return $kartu->status === 'active';
    }

    /**
     * Determine whether the user can revoke the kartu pengpin.
     */
    public function revoke(User $user, KartuPengpin $kartu): bool
    {
        // Only users with permission can revoke
        // Status must be active
        return $kartu->status === 'active' 
            && $user->can('revoke_kartu_pengpin');
    }

    /**
     * Determine whether the user can delete the kartu pengpin.
     */
    public function delete(User $user, KartuPengpin $kartu): bool
    {
        // Only admin can delete, and only if revoked
        return $kartu->status === 'revoked' 
            && $user->can('manage_kartu_pengpin');
    }
}
