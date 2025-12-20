<?php

namespace App\Enums;

enum PermitStatus: string
{
    case DRAFT = 'draft';
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case EXPIRED = 'expired';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match($this) {
            PermitStatus::DRAFT => 'Draft',
            PermitStatus::PENDING => 'Menunggu Persetujuan',
            PermitStatus::APPROVED => 'Disetujui',
            PermitStatus::REJECTED => 'Ditolak',
            PermitStatus::EXPIRED => 'Kadaluarsa',
            PermitStatus::CANCELLED => 'Dibatalkan',
        };
    }

    public function variant(): string
    {
        return match($this) {
            PermitStatus::DRAFT => 'secondary',
            PermitStatus::PENDING => 'warning',
            PermitStatus::APPROVED => 'success',
            PermitStatus::REJECTED => 'destructive',
            PermitStatus::EXPIRED => 'outline',
            PermitStatus::CANCELLED => 'outline',
        };
    }

    public static function getPermitStatuses(): array
    {
        return [
            self::DRAFT->value,
            self::PENDING->value,
            self::APPROVED->value,
            self::REJECTED->value,
            self::EXPIRED->value,
            self::CANCELLED->value,
        ];
    }
}
