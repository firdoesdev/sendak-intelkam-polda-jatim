<?php

namespace App\Enums;

enum RecommendationType: string
{
    case P1 = 'P1';
    case P2 = 'P2';
    case P3 = 'P3';
    case IJIN_GUDANG = 'IJIN_GUDANG';

    public function label(): string
    {
        return match ($this) {
            self::P1 => 'P1',
            self::P2 => 'P2',
            self::P3 => 'P3',
            self::IJIN_GUDANG => 'Ijin Gudang',
        };
    }

    /**
     * Masa berlaku default dalam hari. Null untuk Ijin Gudang karena durasinya
     * dinamis mengikuti rekomendasi instansi terkait (mis. Dinas ESDM).
     */
    public function defaultValidityDays(): ?int
    {
        return match ($this) {
            self::P1 => 180,
            self::P2 => 365,
            self::P3 => 90,
            self::IJIN_GUDANG => null,
        };
    }

    /**
     * P2 tidak dapat diperpanjang; pembelian tambahan wajib mengajukan P2 baru.
     */
    public function isRenewable(): bool
    {
        return $this !== self::P2;
    }

    public function activityType(): ActivityType
    {
        return match ($this) {
            self::P1 => ActivityType::LEFTOVER_USAGE,
            self::P2 => ActivityType::PURCHASE,
            self::P3 => ActivityType::USAGE,
            self::IJIN_GUDANG => ActivityType::STORAGE,
        };
    }

    public function requiredParentType(): ?self
    {
        return match ($this) {
            self::P1, self::P2 => self::P3,
            self::P3 => self::IJIN_GUDANG,
            self::IJIN_GUDANG => null,
        };
    }
}
