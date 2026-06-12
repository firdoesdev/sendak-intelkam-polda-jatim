<?php

namespace App\Actions\Handak;

use App\Models\ExplosivesStockLedger;
use Illuminate\Support\Collection;

class ListHandakStock
{
    /**
     * Saldo stok per organisasi, jenis bahan, dan satuan.
     */
    public function balances(): Collection
    {
        return ExplosivesStockLedger::query()
            ->join('organizations', 'organizations.id', '=', 'explosives_stock_ledger.organization_id')
            ->selectRaw('explosives_stock_ledger.organization_id, organizations.name as organization_name, material_type, unit, SUM(quantity) as balance')
            ->groupBy('explosives_stock_ledger.organization_id', 'organizations.name', 'material_type', 'unit')
            ->orderBy('organizations.name')
            ->orderBy('material_type')
            ->get();
    }

    public function history(array $request)
    {
        return ExplosivesStockLedger::with(['organization:id,name', 'permit:id,permit_number,si_number,recommendation_type', 'creator:id,name'])
            ->when($request['organization_id'] ?? null, function ($query, $organizationId) {
                $query->where('organization_id', $organizationId);
            })
            ->when($request['material_type'] ?? null, function ($query, $materialType) {
                $query->where('material_type', $materialType);
            })
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();
    }
}
