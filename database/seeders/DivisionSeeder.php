<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Division;

class DivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $divisions = [
            [
                'code' => 'SENPI',
                'name' => 'Divisi Senjata dan Perlengkapan',
                'description' => 'Divisi yang mengelola senjata dan perlengkapan terkait.',
                'is_active' => true,
            ],
            [
                'code' => 'POLSUS',
                'name' => 'Divisi Polisi Khusus',
                'description' => 'Divisi yang bertanggung jawab atas operasi polisi khusus.',
                'is_active' => true,
            ],
            [
                'code' => 'HANDAK',
                'name' => 'Divisi Handak',
                'description' => 'Divisi yang mengelola bahan peledak dan alat bantu peledak.',
                'is_active' => true,
            ],
            [
                'code' => 'SPORT',
                'name' => 'Divisi Olahraga',
                'description' => 'Divisi yang mengelola kegiatan olahraga di lingkungan kepolisian.',
                'is_active' => true,
            ],
        ];

        Division::insert($divisions);

    }
}
