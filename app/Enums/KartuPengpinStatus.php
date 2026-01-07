<?php

namespace App\Enums;

enum KartuPengpinStatus: string
{
    case ACTIVE = 'active';
    case EXPIRED = 'expired';
    case REVOKED = 'revoked';
    case SUSPENDED = 'suspended';

    public function label(): string
    {
        return match($this) {
            self::ACTIVE => 'Aktif',
            self::EXPIRED => 'Kadaluarsa',
            self::REVOKED => 'Dicabut',
            self::SUSPENDED => 'Ditangguhkan',
        };
    }

    public function variant(): string
    {
        return match($this) {
            self::ACTIVE => 'success',
            self::EXPIRED => 'outline',
            self::REVOKED => 'destructive',
            self::SUSPENDED => 'warning',
        };
    }

    public static function getStatuses(): array
    {
        return [
            self::ACTIVE->value,
            self::EXPIRED->value,
            self::REVOKED->value,
            self::SUSPENDED->value,
        ];
    }
}
