<?php

namespace App\Enums;

enum PermitType: string
{
    case SENPI = 'SENPI';
    case POLSUS = 'POLSUS';
    case HANDAK = 'HANDAK';
    case SPORT = 'SPORT';

    public function label(): string
    {
        return match($this) {
            PermitType::SENPI => 'Senjata Api',
            PermitType::POLSUS => 'Kepolisian Khusus',
            PermitType::HANDAK => 'Perlengkapan dan Peralatan',
            PermitType::SPORT => 'Olahraga',
        };
    }

    public static function getPermitTypes(): array
    {
        return [
            self::SENPI->value,
            self::POLSUS->value,
            self::HANDAK->value,
            self::SPORT->value,
        ];
    }
}
