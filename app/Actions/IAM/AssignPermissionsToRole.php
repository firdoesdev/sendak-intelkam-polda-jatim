<?php

namespace App\Actions\IAM;

use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class AssignPermissionsToRole
{
    /**
     * Assign permissions to a role.
     */
    public function execute(int $roleId, array $permissionIds): Role
    {
        $role = Role::findOrFail($roleId);
        
        // Sync permissions (this will remove old permissions and add new ones)
        $role->syncPermissions($permissionIds);

        // Log activity
        activity()
            ->performedOn($role)
            ->causedBy(Auth::id())
            ->withProperties(['permission_ids' => $permissionIds])
            ->log('Permissions assigned to role');

        return $role->fresh();
    }
}
