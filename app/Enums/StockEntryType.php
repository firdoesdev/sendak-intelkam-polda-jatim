<?php

namespace App\Enums;

enum StockEntryType: string
{
    case Purchase = 'purchase';
    case Usage = 'usage';
    case LeftoverUsage = 'leftover_usage';
    case Adjustment = 'adjustment';

    public function label(): string
    {
        return match ($this) {
            self::Purchase => 'Pembelian',
            self::Usage => 'Pemakaian',
            self::LeftoverUsage => 'Pemakaian Sisa',
            self::Adjustment => 'Penyesuaian',
        };
    }
}
