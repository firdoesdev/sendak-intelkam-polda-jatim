<?php

namespace App\Enums;

enum ApplicantType: string
{
    case PERSON = 'person';
    case ORGANIZATION = 'organization';

    public function label(): string
    {
        return match($this) {
            ApplicantType::PERSON => 'Perorangan',
            ApplicantType::ORGANIZATION => 'Organisasi',
        };
    }

    public static function getApplicantTypes(): array
    {
        return [
            self::PERSON->value,
            self::ORGANIZATION->value,
        ];
    }
}
