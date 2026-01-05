<?php

namespace App\Enums;

enum ActivityType: string
{
    case STORAGE = 'storage';
    case USAGE = 'usage';
    case APPLICATION = 'application';

    public function label(): string
    {
        return match ($this) {
            self::STORAGE => 'Penyimpanan',
            self::USAGE => 'Pemakaian',
            self::APPLICATION => 'Penggunaan',
        };
    }
}
