<?php

namespace App\Enums;

enum PoliceUnitType:string
{
    // Define enum cases
    case POLDA = 'POLDA';
    case POLRES = 'POLRES';
    case POLSEK = 'POLSEK';

    // Method to get all unit types as an array
    public static function getUnitTypes(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
    
}
