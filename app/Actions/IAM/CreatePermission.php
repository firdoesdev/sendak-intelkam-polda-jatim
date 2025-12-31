<?php

namespace App\Actions\IAM;

use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;

class CreatePermission
{
    /**
     * Create a new permission.
     */
    public function execute(array $data): Permission
    {
        $permission = Permission::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        // Log activity
        activity()
            ->performedOn($permission)
            ->causedBy(Auth::id())
            ->log('Permission created');

        return $permission;
    }
}
