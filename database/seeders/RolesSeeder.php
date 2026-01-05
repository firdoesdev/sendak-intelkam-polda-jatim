<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create default roles
        $roles = [
            'admin' => 'Administrator - Full access',
            'supervisor' => 'Supervisor - Can approve and manage',
            'staff' => 'Staff - Can create records',
            'viewer' => 'Viewer - Read-only access',
        ];

        foreach ($roles as $name => $description) {
            Role::firstOrCreate(
                ['name' => $name],
                ['guard_name' => 'web']
            );
            $this->command->info("✅ Role created: {$name}");
        }

        // Assign admin role to first user if exists
        $firstUser = User::first();
        if ($firstUser && !$firstUser->hasRole('admin')) {
            $firstUser->assignRole('admin');
            $this->command->info("✅ Admin role assigned to: {$firstUser->name}");
        }
    }
}
