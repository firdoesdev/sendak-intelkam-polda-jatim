<?php

namespace App\Actions\IAM;

use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class DeleteRole
{
    /**
     * Delete a role.
     */
    public function execute(int $id): bool
    {
        $role = Role::findOrFail($id);

        // Log activity before deletion
        activity()
            ->performedOn($role)
            ->causedBy(Auth::id())
            ->log('Role deleted');

        return $role->delete();
    }
}
