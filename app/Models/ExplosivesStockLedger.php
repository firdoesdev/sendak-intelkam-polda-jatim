<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;

class ExplosivesStockLedger extends Model
{
    use HasFactory;

    protected $table = 'explosives_stock_ledger';

    protected $fillable = [
        'organization_id',
        'permit_id',
        'material_type',
        'unit',
        'entry_type',
        'quantity',
        'transaction_date',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'transaction_date' => 'date',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function permit(): BelongsTo
    {
        return $this->belongsTo(Permit::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeForOrganization(Builder $query, int $organizationId): Builder
    {
        return $query->where('organization_id', $organizationId);
    }

    public static function balanceFor(int $organizationId, string $materialType, string $unit): float
    {
        return (float) static::query()
            ->where('organization_id', $organizationId)
            ->where('material_type', $materialType)
            ->where('unit', $unit)
            ->sum('quantity');
    }

    /**
     * Saldo stok per (material_type, unit) untuk satu organisasi.
     *
     * @return Collection<int, object{material_type: string, unit: string, balance: float}>
     */
    public static function balancesFor(int $organizationId): Collection
    {
        return static::query()
            ->where('organization_id', $organizationId)
            ->selectRaw('material_type, unit, SUM(quantity) as balance')
            ->groupBy('material_type', 'unit')
            ->orderBy('material_type')
            ->get()
            ->map(fn ($row) => (object) [
                'material_type' => $row->material_type,
                'unit' => $row->unit,
                'balance' => (float) $row->balance,
            ]);
    }
}
