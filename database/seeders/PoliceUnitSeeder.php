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
            ['code'=>'POLDA-JATIM','name' => 'Polda Jawa Timur', 'unit_type' => PoliceUnitType::POLDA->value, 'region' => 'Jawa Timur'],
            
            // Polres
            ['code' =>'POLRES-SBY', 'name' => 'Polres Surabaya', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Surabaya'],
            ['code' =>'POLRES-MLG', 'name' => 'Polres Malang', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Malang'],
            ['code' =>'POLRES-SID', 'name' => 'Polres Sidoarjo', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Sidoarjo'],
            ['code' =>'POLRES-PAS', 'name' => 'Polres Pasuruan', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Pasuruan'],
            ['code' =>'POLRES-PRO', 'name' => 'Polres Probolinggo', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Probolinggo'],
            ['code' =>'POLRES-KED', 'name' => 'Polres Kediri', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Kediri'],
            ['code' =>'POLRES-JBR', 'name' => 'Polres Jember', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Jember'],
            ['code' =>'POLRES-BLT', 'name' => 'Polres Blitar', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Blitar'],
            ['code' =>'POLRES-BWI', 'name' => 'Polres Banyuwangi', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Banyuwangi'],
            ['code' =>'POLRES-MJK', 'name' => 'Polres Mojokerto', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Mojokerto'],
            ['code' =>'POLRES-MDN', 'name' => 'Polres Madiun', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Madiun'],
            ['code' =>'POLRES-GRS', 'name' => 'Polres Gresik', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Gresik'],
            ['code' =>'POLRES-JBG', 'name' => 'Polres Jombang', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Jombang'],
            ['code' =>'POLRES-BJN', 'name' => 'Polres Bojonegoro', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Bojonegoro'],
            ['code' =>'POLRES-TBN', 'name' => 'Polres Tuban', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Tuban'],
            ['code' =>'POLRES-LMG', 'name' => 'Polres Lamongan', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Lamongan'],
            ['code' =>'POLRES-LMJ', 'name' => 'Polres Lumajang', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Lumajang'],
            ['code' =>'POLRES-BDS', 'name' => 'Polres Bondowoso', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Bondowoso'],
            ['code' =>'POLRES-STB', 'name' => 'Polres Situbondo', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Situbondo'],
            ['code' =>'POLRES-NGJ', 'name' => 'Polres Nganjuk', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Nganjuk'],
            ['code' =>'POLRES-MGT', 'name' => 'Polres Magetan', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Magetan'],
            ['code' =>'POLRES-PNR', 'name' => 'Polres Ponorogo', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Ponorogo'],
            ['code' =>'POLRES-TLG', 'name' => 'Polres Tulungagung', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Tulungagung'],
            ['code' =>'POLRES-TGK', 'name' => 'Polres Trenggalek', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Trenggalek'],
            ['code' =>'POLRES-PCT', 'name' => 'Polres Pacitan', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Pacitan'],
            ['code' =>'POLRES-NGW', 'name' => 'Polres Ngawi', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Ngawi'],
            ['code' =>'POLRES-PMK', 'name' => 'Polres Pamekasan', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Pamekasan'],
            ['code' =>'POLRES-SMP', 'name' => 'Polres Sumenep', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Sumenep'],
            ['code' =>'POLRES-SPG', 'name' => 'Polres Sampang', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Sampang'],
            ['code' =>'POLRES-BKL', 'name' => 'Polres Bangkalan', 'unit_type' => PoliceUnitType::POLRES->value, 'region' => 'Bangkalan'],
        ];

        
        PoliceUnit::insert($policeUnits);
        
    }
}
