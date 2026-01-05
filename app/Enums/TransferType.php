<?php

namespace App\Enums;

enum TransferType: string
{
    case PURCHASE = 'purchase';
    case HIBAH = 'hibah';
    case INHERITANCE = 'inheritance';
    case CONFISCATION = 'confiscation';

    public function label(): string
    {
        return match ($this) {
            self::PURCHASE => 'Pembelian',
            self::HIBAH => 'Hibah',
            self::INHERITANCE => 'Warisan',
            self::CONFISCATION => 'Penyitaan',
        };
    }
}
