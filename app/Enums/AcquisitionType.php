<?php

namespace App\Enums;

enum AcquisitionType: string
{
    case NEW = 'new';
    case HIBAH = 'hibah';

    public function label(): string
    {
        return match ($this) {
            self::NEW => 'Baru',
            self::HIBAH => 'Hibah',
        };
    }
}
