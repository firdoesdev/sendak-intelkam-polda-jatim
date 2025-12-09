<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PoliceUnit;
use App\Enums\PoliceUnitType;

class PoliceUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        // \App\Models\PoliceUnit::factory()->count(50)->create();

        $policeUnits = [
            // Polda
            ['code'=>'POLDA-JATIM','name' => 'Polda Jawa Timur', 'unit_type' => PoliceUnitType::POLDA->value, 'region' => 'Jawa Timur','created_at' => now()],
            
            // Polres
            ['code' =>'POLRES-SBY', 'name' => 'Polres Surabaya', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Surabaya', 'created_at' => now()],
            ['code' =>'POLRES-MLG', 'name' => 'Polres Malang', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Malang','created_at' => now()],
            ['code' =>'POLRES-SID', 'name' => 'Polres Sidoarjo', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Sidoarjo','created_at' => now()],
            ['code' =>'POLRES-PAS', 'name' => 'Polres Pasuruan', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Pasuruan','created_at' => now()],
            ['code' =>'POLRES-PRO', 'name' => 'Polres Probolinggo', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Probolinggo','created_at' => now()],
            ['code' =>'POLRES-KED', 'name' => 'Polres Kediri', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Kediri','created_at' => now()],
            ['code' =>'POLRES-JBR', 'name' => 'Polres Jember', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Jember','created_at' => now()],
            ['code' =>'POLRES-BLT', 'name' => 'Polres Blitar', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Blitar','created_at' => now()],
            ['code' =>'POLRES-BWI', 'name' => 'Polres Banyuwangi', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Banyuwangi','created_at' => now()],
            ['code' =>'POLRES-MJK', 'name' => 'Polres Mojokerto', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Mojokerto','created_at' => now()],
            ['code' =>'POLRES-MDN', 'name' => 'Polres Madiun', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Madiun','created_at' => now()],
            ['code' =>'POLRES-GRS', 'name' => 'Polres Gresik', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Gresik','created_at' => now()],
            ['code' =>'POLRES-JBG', 'name' => 'Polres Jombang', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Jombang','created_at' => now()],
            ['code' =>'POLRES-BJN', 'name' => 'Polres Bojonegoro', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Bojonegoro','created_at' => now()],
            ['code' =>'POLRES-TBN', 'name' => 'Polres Tuban', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Tuban','created_at' => now()],
            ['code' =>'POLRES-LMG', 'name' => 'Polres Lamongan', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Lamongan','created_at' => now()],
            ['code' =>'POLRES-LMJ', 'name' => 'Polres Lumajang', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Lumajang','created_at' => now()],
            ['code' =>'POLRES-BDS', 'name' => 'Polres Bondowoso', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Bondowoso','created_at' => now()],
            ['code' =>'POLRES-STB', 'name' => 'Polres Situbondo', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Situbondo','created_at' => now()],
            ['code' =>'POLRES-NGJ', 'name' => 'Polres Nganjuk', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Nganjuk','created_at' => now()],
            ['code' =>'POLRES-MGT', 'name' => 'Polres Magetan', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Magetan','created_at' => now()],
            ['code' =>'POLRES-PNR', 'name' => 'Polres Ponorogo', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Ponorogo','created_at' => now()],
            ['code' =>'POLRES-TLG', 'name' => 'Polres Tulungagung', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Tulungagung','created_at' => now()],
            ['code' =>'POLRES-TGK', 'name' => 'Polres Trenggalek', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Trenggalek','created_at' => now()],
            ['code' =>'POLRES-PCT', 'name' => 'Polres Pacitan', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Pacitan','created_at' => now()],
            ['code' =>'POLRES-NGW', 'name' => 'Polres Ngawi', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Ngawi','created_at' => now()],
            ['code' =>'POLRES-PMK', 'name' => 'Polres Pamekasan', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Pamekasan','created_at' => now()],
            ['code' =>'POLRES-SMP', 'name' => 'Polres Sumenep', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Sumenep','created_at' => now()],
            ['code' =>'POLRES-SPG', 'name' => 'Polres Sampang', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Sampang','created_at' => now()],
            ['code' =>'POLRES-BKL', 'name' => 'Polres Bangkalan', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Bangkalan','created_at' => now()],
        ];

        
        PoliceUnit::insert($policeUnits);
        
    }
}
