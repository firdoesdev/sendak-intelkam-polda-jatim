<?php

namespace App\Actions\IAM;

use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class UpdateRole
{
    /**
     * Update an existing role.
     */
    public function execute(int $id, array $data): Role
    {
        $role = Role::findOrFail($id);
        
        $role->update([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        // Log activity
        activity()
            ->performedOn($role)
            ->causedBy(Auth::id())
            ->log('Role updated');

        return $role;
    }
}
