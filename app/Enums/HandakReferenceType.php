<?php

namespace App\Enums;

enum HandakReferenceType: string
{
    case CompanyRequest = 'company_request';
    case ParentSi = 'parent_si';
    case WarehouseSi = 'warehouse_si';
    case EsdmLetter = 'esdm_letter';
    case PolresRecommendation = 'polres_recommendation';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::CompanyRequest => 'Surat Permohonan Perusahaan',
            self::ParentSi => 'Surat Izin Induk',
            self::WarehouseSi => 'Surat Izin Gudang',
            self::EsdmLetter => 'Surat Dinas ESDM',
            self::PolresRecommendation => 'Rekomendasi Polres',
            self::Other => 'Lainnya',
        };
    }

    public static function getReferenceTypes(): array
    {
        return array_map(fn (self $type) => $type->value, self::cases());
    }
}
