<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Organization;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organizations = [
            // Companies
            [
                'name' => 'PT Mitra Senjata Indonesia',
                'org_type' => 'company',
                'registration_no' => '1234567890123',
                'tax_no' => '01.234.567.8-901.000',
                'address' => 'Jl. Sudirman No. 123',
                'city' => 'Surabaya',
                'province' => 'Jawa Timur',
                'email' => 'contact@mitrasenjata.co.id',
                'created_at' => now(),
            ],
            [
                'name' => 'CV Armada Persenjataan',
                'org_type' => 'company',
                'registration_no' => '2345678901234',
                'tax_no' => '02.345.678.9-012.000',
                'address' => 'Jl. Ahmad Yani No. 45',
                'city' => 'Malang',
                'province' => 'Jawa Timur',
                'email' => 'info@armadapersenjataan.co.id',
                'created_at' => now(),
            ],
            [
                'name' => 'PT Sejahtera Security Equipment',
                'org_type' => 'company',
                'registration_no' => '3456789012345',
                'tax_no' => '03.456.789.0-123.000',
                'address' => 'Jl. Pahlawan No. 67',
                'city' => 'Surabaya',
                'province' => 'Jawa Timur',
                'email' => 'admin@sejahterasecurity.com',
                'created_at' => now(),
            ],
            
            // Clubs
            [
                'name' => 'Klub Menembak Surabaya',
                'org_type' => 'club',
                'registration_no' => '4567890123456',
                'tax_no' => null,
                'address' => 'Jl. Raya Darmo No. 89',
                'city' => 'Surabaya',
                'province' => 'Jawa Timur',
                'email' => 'info@klubmenembasbury.org',
                'created_at' => now(),
            ],
            [
                'name' => 'Perbakin Jawa Timur',
                'org_type' => 'club',
                'registration_no' => '5678901234567',
                'tax_no' => null,
                'address' => 'Jl. Basuki Rahmat No. 234',
                'city' => 'Surabaya',
                'province' => 'Jawa Timur',
                'email' => 'perbakin.jatim@gmail.com',
                'created_at' => now(),
            ],
            
            // Government
            [
                'name' => 'Dinas Perhubungan Kota Surabaya',
                'org_type' => 'government',
                'registration_no' => '6789012345678',
                'tax_no' => '04.567.890.1-234.000',
                'address' => 'Jl. Pemuda No. 12',
                'city' => 'Surabaya',
                'province' => 'Jawa Timur',
                'email' => 'dishub@surabaya.go.id',
                'created_at' => now(),
            ],
            [
                'name' => 'Satpol PP Kota Malang',
                'org_type' => 'government',
                'registration_no' => '7890123456789',
                'tax_no' => '05.678.901.2-345.000',
                'address' => 'Jl. Tugu No. 1',
                'city' => 'Malang',
                'province' => 'Jawa Timur',
                'email' => 'satpolpp@malangkota.go.id',
                'created_at' => now(),
            ],
            
            // Other
            [
                'name' => 'Yayasan Keamanan Nusantara',
                'org_type' => 'other',
                'registration_no' => '8901234567890',
                'tax_no' => null,
                'address' => 'Jl. Veteran No. 56',
                'city' => 'Sidoarjo',
                'province' => 'Jawa Timur',
                'email' => 'kontak@yayasankeamanan.or.id',
                'created_at' => now(),
            ],
            [
                'name' => 'Lembaga Pengawasan Senjata Api',
                'org_type' => 'other',
                'registration_no' => '9012345678901',
                'tax_no' => null,
                'address' => 'Jl. Gatot Subroto No. 78',
                'city' => 'Surabaya',
                'province' => 'Jawa Timur',
                'email' => 'lpsa@organization.id',
                'created_at' => now(),
            ],
            [
                'name' => 'PT Bina Jasa Keamanan',
                'org_type' => 'company',
                'registration_no' => '0123456789012',
                'tax_no' => '06.789.012.3-456.000',
                'address' => 'Jl. Raya Waru No. 90',
                'city' => 'Sidoarjo',
                'province' => 'Jawa Timur',
                'email' => 'hrd@binajasakamanan.co.id',
                'created_at' => now(),
            ],
        ];

        Organization::insert($organizations);
    }
}
