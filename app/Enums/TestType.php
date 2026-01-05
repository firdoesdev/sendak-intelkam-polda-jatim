<?php

namespace App\Enums;

enum TestType: string
{
    case HEALTH = 'health';
    case PSYCHOLOGY = 'psychology';
    case SHOOTING = 'shooting';

    public function label(): string
    {
        return match ($this) {
            self::HEALTH => 'Kesehatan',
            self::PSYCHOLOGY => 'Psikologi',
            self::SHOOTING => 'Menembak',
        };
    }
}
