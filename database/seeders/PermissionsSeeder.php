<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions for Hibah Transfer
        $hibahPermissions = [
            'create_hibah_transfer' => 'Membuat Transfer Hibah',
            'approve_hibah_transfer' => 'Menyetujui Transfer Hibah',
            'manage_hibah_transfer' => 'Mengelola Semua Transfer Hibah',
        ];

        foreach ($hibahPermissions as $name => $description) {
            Permission::firstOrCreate(
                ['name' => $name],
                ['guard_name' => 'web']
            );
        }

        // Create permissions for Kartu Pengpin
        $kartuPermissions = [
            'create_kartu_pengpin' => 'Membuat Kartu Pengpin',
            'revoke_kartu_pengpin' => 'Mencabut Kartu Pengpin',
            'manage_kartu_pengpin' => 'Mengelola Semua Kartu Pengpin',
        ];

        foreach ($kartuPermissions as $name => $description) {
            Permission::firstOrCreate(
                ['name' => $name],
                ['guard_name' => 'web']
            );
        }

        // Create permissions for Permit Documents
        $docPermissions = [
            'manage_permit_documents' => 'Mengelola Dokumen Permit',
        ];

        foreach ($docPermissions as $name => $description) {
            Permission::firstOrCreate(
                ['name' => $name],
                ['guard_name' => 'web']
            );
        }

        // Create permissions for Weapon CRUD & Transfer
        $weaponPermissions = [
            'view-weapons' => 'Melihat Data Senjata',
            'create-weapons' => 'Menambah Senjata',
            'edit-weapons' => 'Mengubah Data Senjata',
            'delete-weapons' => 'Menghapus Senjata',
            'create-transfer-requests' => 'Membuat Permintaan Transfer Senjata',
            'approve-transfer-requests' => 'Menyetujui Permintaan Transfer Senjata',
        ];

        foreach ($weaponPermissions as $name => $description) {
            Permission::firstOrCreate(
                ['name' => $name],
                ['guard_name' => 'web']
            );
        }

        $this->command->info('✅ Permissions created successfully!');

        // Assign permissions to roles
        $this->assignPermissionsToRoles();
    }

    /**
     * Assign permissions to default roles.
     */
    private function assignPermissionsToRoles(): void
    {
        // Admin gets all permissions
        $admin = Role::where('name', 'admin')->first();
        if ($admin) {
            $admin->givePermissionTo([
                'create_hibah_transfer',
                'approve_hibah_transfer',
                'manage_hibah_transfer',
                'create_kartu_pengpin',
                'revoke_kartu_pengpin',
                'manage_kartu_pengpin',
                'manage_permit_documents',
                'view-weapons',
                'create-weapons',
                'edit-weapons',
                'delete-weapons',
                'create-transfer-requests',
                'approve-transfer-requests',
            ]);
            $this->command->info('✅ Admin permissions assigned');
        }

        // Staff can create but not approve
        $staff = Role::where('name', 'staff')->first();
        if ($staff) {
            $staff->givePermissionTo([
                'create_hibah_transfer',
                'create_kartu_pengpin',
                'view-weapons',
                'create-weapons',
                'edit-weapons',
                'create-transfer-requests',
            ]);
            $this->command->info('✅ Staff permissions assigned');
        }

        // Supervisor can approve
        $supervisor = Role::where('name', 'supervisor')->first();
        if ($supervisor) {
            $supervisor->givePermissionTo([
                'create_hibah_transfer',
                'approve_hibah_transfer',
                'create_kartu_pengpin',
                'revoke_kartu_pengpin',
                'manage_permit_documents',
                'view-weapons',
                'create-weapons',
                'edit-weapons',
                'create-transfer-requests',
                'approve-transfer-requests',
            ]);
            $this->command->info('✅ Supervisor permissions assigned');
        }

        // Viewer — read-only access
        $viewer = Role::where('name', 'viewer')->first();
        if ($viewer) {
            $viewer->givePermissionTo([
                'view-weapons',
            ]);
            $this->command->info('✅ Viewer permissions assigned');
        }
    }
}
