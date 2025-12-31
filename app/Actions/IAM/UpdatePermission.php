<?php

namespace App\Actions\IAM;

use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;

class UpdatePermission
{
    /**
     * Update an existing permission.
     */
    public function execute(int $id, array $data): Permission
    {
        $permission = Permission::findOrFail($id);
        
        $permission->update([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        // Log activity
        activity()
            ->performedOn($permission)
            ->causedBy(Auth::id())
            ->log('Permission updated');

        return $permission;
    }
}
