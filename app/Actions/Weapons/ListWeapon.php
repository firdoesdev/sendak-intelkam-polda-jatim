<?php

namespace App\Actions\Weapons;

use App\Models\Weapon;
use Illuminate\Pagination\LengthAwarePaginator;

class ListWeapon
{
    public function execute(array $filters = []): LengthAwarePaginator
    {
        $query = Weapon::with(['warehouse.policeUnit', 'warehouse.organization']);

        // Filter by warehouse
        if (!empty($filters['warehouse_id'])) {
            $query->where('warehouse_id', $filters['warehouse_id']);
        }

        // Filter by permit type
        if (!empty($filters['permit_type'])) {
            $query->where('permit_type', $filters['permit_type']);
        }

        // Filter by status
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filter by condition
        if (!empty($filters['condition'])) {
            $query->where('condition', $filters['condition']);
        }

        // Search by code, name, or serial number
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%")
                    ->orWhere('manufacturer', 'like', "%{$search}%");
            });
        }

        // Filter active only by default
        if (!isset($filters['include_inactive'])) {
            $query->where('is_active', true);
        }

        return $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
    }
}
