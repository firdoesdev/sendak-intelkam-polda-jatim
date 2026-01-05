<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\KartuPengpin;
use App\Models\Permit;
use App\Models\Person;
use App\Models\Weapon;
use App\Models\Warehouse;
use App\Models\WeaponHibahTransferRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🔍 Checking existing data...');
        
        // Check required existing data
        if (User::count() === 0) {
            $this->command->error('❌ No users found. Run main seeder first: php artisan migrate:fresh --seed');
            return;
        }

        $this->command->info('✅ Found users: ' . User::count());
        $this->command->info('✅ Found persons: ' . Person::count());
        $this->command->info('✅ Found weapons: ' . Weapon::count());
        $this->command->info('✅ Found permits: ' . Permit::count());

        $this->command->newLine();
        $this->command->info('📝 This seeder only creates test data for:');
        $this->command->info('   - Weapon Hibah Transfer Requests');
        $this->command->info('   - Kartu Pengpin');
        $this->command->newLine();
        $this->command->info('💡 TIP: If you need more base data, run: php artisan migrate:fresh --seed');
        $this->command->newLine();

        if ($this->command->confirm('Continue with test data creation?', true)) {
            $this->createTestData();
        }
    }

    private function createTestData(): void
    {
        $user = User::first();
        $persons = Person::limit(5)->get();
        $weapons = Weapon::limit(5)->get();
        $permits = Permit::limit(5)->get();

        if ($persons->count() < 2) {
            $this->command->error('❌ Need at least 2 persons. Please add more base data.');
            return;
        }

        if ($weapons->count() < 2) {
            $this->command->error('❌ Need at least 2 weapons. Please add more base data.');
            return;
        }

        if ($permits->count() < 2) {
            $this->command->error('❌ Need at least 2 permits. Please add more base data.');
            return;
        }

        // Create hibah transfer requests
        $this->command->info('Creating hibah transfer requests...');
        
        WeaponHibahTransferRequest::updateOrCreate(
            ['id' => 9999],  // Use high ID to avoid conflicts
            [
                'weapon_id' => $weapons->first()->id,
                'from_person_id' => $persons->get(0)->id,
                'from_permit_id' => $permits->first()->id,
                'to_person_id' => $persons->get(1)->id,
                'to_permit_id' => null,
                'status' => 'draft',
                'transfer_reason' => 'Test draft transfer - Hibah dari orang tua ke anak',
            ]
        );

        WeaponHibahTransferRequest::updateOrCreate(
            ['id' => 9998],
            [
                'weapon_id' => $weapons->get(1)->id,
                'from_person_id' => $persons->get(0)->id,
                'from_permit_id' => $permits->get(0)->id,
                'to_person_id' => $persons->get(1)->id,
                'to_permit_id' => $permits->get(1)->id,
                'status' => 'pending',
                'submitted_at' => now()->subDays(2),
                'transfer_reason' => 'Test pending transfer - Hibah kepada anggota keluarga',
            ]
        );

        $this->command->info('✅ Created 2 hibah transfer requests (draft, pending)');

        // Create Kartu Pengpin (only for POLSUS permits)
        $polsusPermits = $permits->where('permit_type', 'POLSUS');
        
        if ($polsusPermits->count() > 0) {
            $this->command->info('Creating kartu pengpin...');

            KartuPengpin::updateOrCreate(
                ['id' => 9999],
                [
                    'permit_id' => $polsusPermits->first()->id,
                    'person_id' => $persons->first()->id,
                    'weapon_id' => $weapons->first()->id,
                    'card_number' => 'PENGPIN-' . now()->format('Ym') . '-9999',
                    'issued_at' => now()->subMonths(2),
                    'expired_at' => now()->addYear(),
                    'status' => 'active',
                ]
            );

            $this->command->info('✅ Created 1 kartu pengpin (active)');
        } else {
            $this->command->warn('⚠️  No POLSUS permits found. Skipping kartu pengpin creation.');
            $this->command->info('   (Kartu Pengpin requires POLSUS permit type)');
        }

        $this->command->newLine();
        $this->command->info('🎉 Test data created successfully!');
        $this->command->info('📍 Visit these pages to see the data:');
        $this->command->info('   - /weapons/hibah-transfers');
        $this->command->info('   - /kartu-pengpin');
    }
}
