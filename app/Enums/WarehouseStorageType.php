<?php

namespace App\Enums;

enum WarehouseStorageType:string
{
    //
    case POLICE_UNIT = 'POLICE_UNIT';
    case HANDAK_WAREHOUSE = 'HANDAK_WAREHOUSE';
    case PERBAKIN = 'PERBAKIN';

    public static function getWarehouseStorageTypes(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
