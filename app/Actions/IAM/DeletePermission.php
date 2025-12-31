<?php

namespace App\Actions\IAM;

use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;

class DeletePermission
{
    /**
     * Delete a permission.
     */
    public function execute(int $id): bool
    {
        $permission = Permission::findOrFail($id);

        // Log activity before deletion
        activity()
            ->performedOn($permission)
            ->causedBy(Auth::id())
            ->log('Permission deleted');

        return $permission->delete();
    }
}
