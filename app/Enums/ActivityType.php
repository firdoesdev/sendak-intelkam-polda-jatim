<?php

namespace App\Enums;

enum ActivityType: string
{
    case STORAGE = 'storage';
    case USAGE = 'usage';
    case APPLICATION = 'application';
    case PURCHASE = 'purchase';
    case LEFTOVER_USAGE = 'leftover_usage';

    public function label(): string
    {
        return match ($this) {
            self::STORAGE => 'Penyimpanan',
            self::USAGE => 'Pemakaian',
            self::APPLICATION => 'Penggunaan',
            self::PURCHASE => 'Pembelian/Produksi',
            self::LEFTOVER_USAGE => 'Penggunaan Sisa',
        };
    }
}
