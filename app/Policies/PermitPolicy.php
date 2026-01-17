<?php

namespace App\Policies;

use App\Models\Permit;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class PermitPolicy
{
    use HandlesAuthorization;
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view-permits');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Permit $permit): bool
    {
        return $user->hasPermissionTo('view-permits');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create-permits');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Permit $permit): bool
    {
        
        return $user->can('edit-permits') && $permit->division->id === $user->default_division_id;
        // return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Permit $permit): bool
    {
        return $user->can('delete-permits') && $permit->division->id === $user->division_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Permit $permit): bool
    {
        return $user->hasPermissionTo('update-permits') && $permit->division->id === $user->default_division_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Permit $permit): bool
    {
        return $user->hasPermissionTo('delete-permits');
    }
}
