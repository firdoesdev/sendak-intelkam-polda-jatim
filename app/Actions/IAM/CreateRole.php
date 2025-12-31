<?php

namespace App\Actions\IAM;

use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class CreateRole
{
    /**
     * Create a new role.
     */
    public function execute(array $data): Role
    {
        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        // Log activity
        activity()
            ->performedOn($role)
            ->causedBy(Auth::id())
            ->log('Role created');

        return $role;
    }
}
