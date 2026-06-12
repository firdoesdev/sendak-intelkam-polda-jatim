<?php

namespace Database\Seeders;

use App\Models\ExplosiveMaterialType;
use Illuminate\Database\Seeder;

class ExplosiveMaterialTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Amonium Nitrate / Anfo', 'default_unit' => 'kg'],
            ['name' => 'Dinamite / Power Gel', 'default_unit' => 'kg'],
            ['name' => 'Detonator Cord', 'default_unit' => 'm'],
            ['name' => 'Detonator Listrik', 'default_unit' => 'pcs'],
        ];

        foreach ($types as $type) {
            ExplosiveMaterialType::firstOrCreate(
                ['name' => $type['name']],
                ['default_unit' => $type['default_unit'], 'is_active' => true]
            );
        }
    }
}
