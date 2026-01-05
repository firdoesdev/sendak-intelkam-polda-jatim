<?php

namespace App\Enums;

enum DocumentType: string
{
    case KTP = 'ktp';
    case NPWP = 'npwp';
    case KSK = 'ksk';
    case SKEP_JABATAN = 'skep_jabatan';
    case KTA = 'kta';
    case IMPORT_PERMIT = 'import_permit';
    case HEALTH_TEST = 'health_test';
    case PSYCH_TEST = 'psych_test';
    case SHOOTING_TEST = 'shooting_test';
    case SURAT_HIBAH = 'surat_hibah';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::KTP => 'KTP',
            self::NPWP => 'NPWP',
            self::KSK => 'Keterangan Sehat Kelakuan',
            self::SKEP_JABATAN => 'Skep Jabatan',
            self::KTA => 'Kartu Tanda Anggota',
            self::IMPORT_PERMIT => 'Surat Ijin Impor',
            self::HEALTH_TEST => 'Hasil Tes Kesehatan',
            self::PSYCH_TEST => 'Hasil Tes Psikologi',
            self::SHOOTING_TEST => 'Hasil Tes Menembak',
            self::SURAT_HIBAH => 'Surat Hibah',
            self::OTHER => 'Lainnya',
        };
    }
}
