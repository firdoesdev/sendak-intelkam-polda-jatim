<?php

namespace App\Enums;

enum OrganizationType:string
{
    //
    case COMPANY = 'COMPANY';
    case CLUB = 'CLUB';
    case GOVERNMENT = 'GOVERNMENT';
    case OTHER = 'OTHER';

    public static function getOrganizationTypes(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
