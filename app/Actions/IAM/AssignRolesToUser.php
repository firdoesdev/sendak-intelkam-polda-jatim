<?php

namespace App\Actions\IAM;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AssignRolesToUser
{
    /**
     * Assign roles to a user.
     */
    public function execute(int $userId, array $roleIds): User
    {
        $user = User::findOrFail($userId);
        
        // Sync roles (this will remove old roles and add new ones)
        $user->syncRoles($roleIds);

        // Log activity
        activity()
            ->performedOn($user)
            ->causedBy(Auth::id())
            ->withProperties(['role_ids' => $roleIds])
            ->log('Roles assigned to user');

        return $user->fresh();
    }
}
