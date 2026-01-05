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

    public function defaultValidityDays(): int
    {
        return match ($this) {
            self::P1 => 180,
            self::P2 => 365,
            self::P3 => 90,
            self::IJIN_GUDANG => 730,
        };
    }
}
