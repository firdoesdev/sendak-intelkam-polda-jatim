<?php

namespace App\Policies;

use App\Models\PermitRenewal;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PermitRenewalPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PermitRenewal $permitRenewal): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('request-permit-renewals');
        // return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PermitRenewal $permitRenewal): bool
    {
        return $user->can('request-permit-renewals');
        // return true;
    }

    public function approve(User $user): bool
    {
        return $user->can('approval-permit-renewals');
        // return true
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PermitRenewal $permitRenewal): bool
    {
        return true;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, PermitRenewal $permitRenewal): bool
    {
        return true;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, PermitRenewal $permitRenewal): bool
    {
        return true;
    }
}
