<?php

namespace App\Enums;

enum WeaponStatus: string
{
    case AVAILABLE = 'available';
    case ISSUED = 'issued';
    case MAINTENANCE = 'maintenance';
    case DECOMMISSIONED = 'decommissioned';

    public function label(): string
    {
        return match($this) {
            WeaponStatus::AVAILABLE => 'Tersedia',
            WeaponStatus::ISSUED => 'Dipinjamkan',
            WeaponStatus::MAINTENANCE => 'Maintenance',
            WeaponStatus::DECOMMISSIONED => 'Tidak Aktif',
        };
    }

    public function variant(): string
    {
        return match($this) {
            WeaponStatus::AVAILABLE => 'success',
            WeaponStatus::ISSUED => 'warning',
            WeaponStatus::MAINTENANCE => 'secondary',
            WeaponStatus::DECOMMISSIONED => 'destructive',
        };
    }

    public static function getWeaponStatuses(): array
    {
        return [
            self::AVAILABLE->value,
            self::ISSUED->value,
            self::MAINTENANCE->value,
            self::DECOMMISSIONED->value,
        ];
    }
}
