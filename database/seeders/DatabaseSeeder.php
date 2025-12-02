<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        User::factory(20)->create();

         // basic permissions Phase 1
    $permissions = [
        'manage-masters',   // divisions, police_units, storages, organizations, persons
        'view-permits',
        'manage-permits',
    ];

    foreach ($permissions as $perm) {
        Permission::firstOrCreate(['name' => $perm]);
    }

    $adminRole   = Role::firstOrCreate(['name' => 'admin-sendak']);
    $operatorRole = Role::firstOrCreate(['name' => 'operator']);

    $adminRole->givePermissionTo($permissions);
    $operatorRole->givePermissionTo(['view-permits']);

     $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

    // Assign ke user pertama
    // $user = User::first(); // contoh, atau create manual
    if ($user) {
        $user->assignRole('admin-sendak');
    }

       
    }
}
