<?php

namespace App\Services;

use App\Models\Person;
use App\Models\Permit;
use App\Models\Warehouse;
use App\Enums\PermitType;

class PermitValidationService
{
    public function validatePersonCredentials(Person $person, string $permitType): array
    {
        $warnings = [];

        // Check KTP
        if (empty($person->ktp_number)) {
            $warnings[] = 'KTP number is required';
        }

        // Check NPWP for organization-related permits
        if (in_array($permitType, [PermitType::HANDAK->value]) && empty($person->npwp_number)) {
            $warnings[] = 'NPWP is recommended for HANDAK permits';
        }

        // Check test results
        if ($person->has_valid_test_results === false) {
            $warnings[] = 'Person must have valid health, psychology, and shooting test results';
        }

        // Check Buku PAS expiry
        if ($person->is_buku_pas_expired) {
            $warnings[] = 'Buku PAS has expired';
        }

        // Check Kartu Ikhsa expiry for specific divisions
        if (in_array($permitType, [PermitType::SENPI->value, PermitType::SPORT->value])) {
            if ($person->is_kartu_ikhsa_expired) {
                $warnings[] = 'Kartu Ikhsa has expired';
            }
        }

        return $warnings;
    }

    public function validateHandakWarehouseCapacity(Warehouse $warehouse, float $additionalWeight): array
    {
        $warnings = [];

        if ($warehouse->capacity_kg === null) {
            $warnings[] = 'Warehouse capacity not configured';
            return $warnings;
        }

        $currentLoad = $warehouse->current_load_kg ?? 0;
        $newLoad = $currentLoad + $additionalWeight;

        if ($newLoad > $warehouse->capacity_kg) {
            $warnings[] = sprintf(
                'Warehouse will exceed capacity: %.2f kg / %.2f kg (%.1f%% full)',
                $newLoad,
                $warehouse->capacity_kg,
                ($newLoad / $warehouse->capacity_kg) * 100
            );
        } elseif ($newLoad > $warehouse->capacity_kg * 0.9) {
            $warnings[] = sprintf(
                'Warehouse approaching capacity: %.2f kg / %.2f kg (%.1f%% full)',
                $newLoad,
                $warehouse->capacity_kg,
                ($newLoad / $warehouse->capacity_kg) * 100
            );
        }

        return $warnings;
    }

    public function getPermitExpiryWarnings(Permit $permit): array
    {
        $warnings = [];

        if ($permit->valid_to === null) {
            return $warnings;
        }

        $daysUntilExpiry = now()->diffInDays($permit->valid_to, false);

        if ($daysUntilExpiry < 0) {
            $warnings[] = sprintf('Permit expired %d days ago', abs($daysUntilExpiry));
        } elseif ($daysUntilExpiry <= 30) {
            $warnings[] = sprintf('Permit will expire in %d days', $daysUntilExpiry);
        } elseif ($daysUntilExpiry <= 90) {
            $warnings[] = sprintf('Permit expiring soon (%d days remaining)', $daysUntilExpiry);
        }

        return $warnings;
    }
}
