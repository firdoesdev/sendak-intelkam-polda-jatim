<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\Division;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if(app()->environment('APP_ENV') !== 'production') {
            $this->call([
                DivisionSeeder::class,
                PoliceUnitSeeder::class,
                WarehouseSeeder::class,
                OrganizationSeeder::class,
                // WeaponSeeder::class
            ]);
        }
        
        User::factory(20)->create([
            'police_unit_id' => \App\Models\PoliceUnit::inRandomOrder()->first()?->id,
            'default_division_id' => Division::inRandomOrder()->first()?->id,
        ]);

         // basic permissions Phase 1
        $permissions = [
            'manage-masters',   // divisions, police_units, storages, organizations, persons
            
            // CRUD Permits
            'view-permits',
            'create-permits',
            'edit-permits',
            'delete-permits',
            // Handle Request & Approval Permit Renewal
            'request-permit-renewals',
            'approval-permit-renewals',
            'create-permit-renewals',
            'view-permit-renewals',
            'edit-permit-renewals',
            'delete-permit-renewals',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        // Create Roles and assign existing permissions
        $superAdminRole   = Role::firstOrCreate(['name' => 'super-admin']);
        $senpiRole = Role::firstOrCreate(['name' => 'senpi']);
        $polsusRole = Role::firstOrCreate(['name' => 'polsus']);
        $handakRole = Role::firstOrCreate(['name' => 'handak']);
        $sportRole = Role::firstOrCreate(['name' => 'sport']);

        // Assign Permissions to Roles  
        $superAdminRole->givePermissionTo($permissions);
        $senpiRole->givePermissionTo($permissions);
        $polsusRole->givePermissionTo($permissions);
        $handakRole->givePermissionTo($permissions);
        $sportRole->givePermissionTo($permissions);

        $superAdminUser = User::firstOrCreate(
                ['email' => 'test@example.com'],
                [
                    'name' => 'Test User',
                    'password' => 'password',
                    'email_verified_at' => now(),
                    'default_division_id' => Division::where('code','SENPI')->first()?->id,
                    'police_unit_id' => \App\Models\PoliceUnit::inRandomOrder()->first()?->id,
                ]
            );

        // Assign ke user pertama
        if ($superAdminUser) {
            $superAdminUser->assignRole('super-admin');
        }

      
       
    }
}
