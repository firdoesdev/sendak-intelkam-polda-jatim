<?php

namespace App\Enums;

enum WeaponCondition: string
{
    case NEW = 'new';
    case EXCELLENT = 'excellent';
    case GOOD = 'good';
    case FAIR = 'fair';
    case POOR = 'poor';
    case DAMAGED = 'damaged';

    public function label(): string
    {
        return match($this) {
            WeaponCondition::NEW => 'Baru',
            WeaponCondition::EXCELLENT => 'Sangat Baik',
            WeaponCondition::GOOD => 'Baik',
            WeaponCondition::FAIR => 'Cukup',
            WeaponCondition::POOR => 'Kurang',
            WeaponCondition::DAMAGED => 'Rusak',
        };
    }

    public function variant(): string
    {
        return match($this) {
            WeaponCondition::NEW => 'default',
            WeaponCondition::EXCELLENT => 'success',
            WeaponCondition::GOOD => 'success',
            WeaponCondition::FAIR => 'warning',
            WeaponCondition::POOR => 'warning',
            WeaponCondition::DAMAGED => 'destructive',
        };
    }

    public static function getWeaponConditions(): array
    {
        return [
            self::NEW->value,
            self::EXCELLENT->value,
            self::GOOD->value,
            self::FAIR->value,
            self::POOR->value,
            self::DAMAGED->value,
        ];
    }
}
