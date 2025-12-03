<?php

namespace App\Enums;

enum DivisionCode:string
{
    //SENPI, POLSUS, HANDAK, SPORT
    case SENPI ='SENPI';
    case POLSUS ='POLSUS';
    case HANDAK ="HANDAK";
    case SPORT = "SPORT";

    public function label(): string
    {
        return match($this) {
            DivisionCode::SENPI => 'Senjata Api',
            DivisionCode::POLSUS => 'Kepolisian Khusus',
            DivisionCode::HANDAK => 'Perlengkapan dan Peralatan',
            DivisionCode::SPORT => 'Olahraga',
        };
    }

    public static function getDivisionCodes(): array
    {
        return [
            self::SENPI->value,
            self::POLSUS->value,
            self::HANDAK->value,
            self::SPORT->value,
        ];
    }
}
