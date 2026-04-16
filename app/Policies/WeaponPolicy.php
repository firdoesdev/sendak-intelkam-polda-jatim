<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Weapon;
use Illuminate\Auth\Access\HandlesAuthorization;

class WeaponPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('view-weapons');
    }

    public function view(User $user, Weapon $weapon): bool
    {
        return $user->can('view-weapons');
    }

    public function create(User $user): bool
    {
        return $user->can('create-weapons');
    }

    public function update(User $user, Weapon $weapon): bool
    {
        return $user->can('edit-weapons');
    }

    public function delete(User $user, Weapon $weapon): bool
    {
        return $user->can('delete-weapons');
    }
}
