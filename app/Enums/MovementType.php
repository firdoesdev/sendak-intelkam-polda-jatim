<?php

namespace App\Enums;

enum MovementType: string
{
    case CHECK_IN = 'check_in';
    case CHECK_OUT = 'check_out';
    case TRANSFER = 'transfer';
    case MAINTENANCE = 'maintenance';
    case RETURN_FROM_MAINTENANCE = 'return_from_maintenance';
    case DISPOSAL = 'disposal';

    public function label(): string
    {
        return match($this) {
            MovementType::CHECK_IN => 'Masuk Gudang',
            MovementType::CHECK_OUT => 'Keluar Gudang',
            MovementType::TRANSFER => 'Transfer Gudang',
            MovementType::MAINTENANCE => 'Masuk Maintenance',
            MovementType::RETURN_FROM_MAINTENANCE => 'Kembali dari Maintenance',
            MovementType::DISPOSAL => 'Pemusnahan',
        };
    }

    public function variant(): string
    {
        return match($this) {
            MovementType::CHECK_IN => 'success',
            MovementType::CHECK_OUT => 'warning',
            MovementType::TRANSFER => 'default',
            MovementType::MAINTENANCE => 'secondary',
            MovementType::RETURN_FROM_MAINTENANCE => 'success',
            MovementType::DISPOSAL => 'destructive',
        };
    }

    public static function getMovementTypes(): array
    {
        return [
            self::CHECK_IN->value,
            self::CHECK_OUT->value,
            self::TRANSFER->value,
            self::MAINTENANCE->value,
            self::RETURN_FROM_MAINTENANCE->value,
            self::DISPOSAL->value,
        ];
    }
}
