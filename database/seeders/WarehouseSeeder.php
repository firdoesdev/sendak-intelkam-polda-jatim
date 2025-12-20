<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Warehouse;
use App\Models\PoliceUnit;
use App\Enums\WarehouseStorageType;

class WarehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $polda = PoliceUnit::where('code', 'POLDA-JATIM')->first();
        $polresSby = PoliceUnit::where('code', 'POLRES-SBY')->first();
        $polresMlg = PoliceUnit::where('code', 'POLRES-MLG')->first();
        $polresSid = PoliceUnit::where('code', 'POLRES-SID')->first();
        $polresJbr = PoliceUnit::where('code', 'POLRES-JBR')->first();

        $warehouses = [
            [
                'code' => 'WH-POLDA-001',
                'name' => 'Gudang Senjata Polda Jatim',
                'storage_type' => WarehouseStorageType::POLICE_UNIT->value,
                'police_unit_id' => $polda?->id,
                'organization_id' => null,
                'address' => 'Jl. Ahmad Yani No. 116',
                'city' => 'Surabaya',
                'province' => 'Jawa Timur',
                'is_active' => true,
                'created_at' => now(),
            ],
            [
                'code' => 'WH-HANDAK-001',
                'name' => 'Gudang Handak Surabaya',
                'storage_type' => WarehouseStorageType::HANDAK_WAREHOUSE->value,
                'police_unit_id' => $polresSby?->id,
                'organization_id' => null,
                'address' => 'Jl. Raya Kandangan No. 45',
                'city' => 'Surabaya',
                'province' => 'Jawa Timur',
                'is_active' => true,
                'created_at' => now(),
            ],
            [
                'code' => 'WH-PERBAKIN-MLG',
                'name' => 'Gudang Perbakin Malang',
                'storage_type' => WarehouseStorageType::PERBAKIN->value,
                'police_unit_id' => $polresMlg?->id,
                'organization_id' => null,
                'address' => 'Jl. Soekarno Hatta No. 28',
                'city' => 'Malang',
                'province' => 'Jawa Timur',
                'is_active' => true,
                'created_at' => now(),
            ],
            [
                'code' => 'WH-POLRES-SID',
                'name' => 'Gudang Senpi Polres Sidoarjo',
                'storage_type' => WarehouseStorageType::POLICE_UNIT->value,
                'police_unit_id' => $polresSid?->id,
                'organization_id' => null,
                'address' => 'Jl. Diponegoro No. 156',
                'city' => 'Sidoarjo',
                'province' => 'Jawa Timur',
                'is_active' => true,
                'created_at' => now(),
            ],
            [
                'code' => 'WH-HANDAK-JBR',
                'name' => 'Gudang Handak Jember',
                'storage_type' => WarehouseStorageType::HANDAK_WAREHOUSE->value,
                'police_unit_id' => $polresJbr?->id,
                'organization_id' => null,
                'address' => 'Jl. Gajah Mada No. 234',
                'city' => 'Jember',
                'province' => 'Jawa Timur',
                'is_active' => true,
                'created_at' => now(),
            ],
        ];

        Warehouse::insert($warehouses);
    }
}
