<?php

namespace App\Policies;

use App\Models\User;
use App\Models\PermitRenewal;

class PermitRenewalPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine whether the user can view the permit renewal.
     */    
    public function view(User $user, PermitRenewal $permitRenewal): bool
    {
        // All authenticated users can view permit renewals
        // In production, you might want to restrict based on permit ownership
        return true; 
    }

    public function create(User $user): bool
    {
        // Any authenticated user can create a permit renewal request
        return true; 
    }   

    public function update(User $user, PermitRenewal $permitRenewal): bool
    {
        // dd($user->id, $permitRenewal->requested_by);
        // Only users with approval permission can approve/reject
        // Status must be pending
        return $user->can('approve-permit-renewals');
    }
}
