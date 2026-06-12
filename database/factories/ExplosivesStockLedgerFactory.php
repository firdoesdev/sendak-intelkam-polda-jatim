<?php

namespace Database\Factories;

use App\Enums\StockEntryType;
use App\Models\ExplosivesStockLedger;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ExplosivesStockLedger>
 */
class ExplosivesStockLedgerFactory extends Factory
{
    protected $model = ExplosivesStockLedger::class;

    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'material_type' => 'Amonium Nitrate / Anfo',
            'unit' => 'kg',
            'entry_type' => StockEntryType::Purchase->value,
            'quantity' => fake()->randomFloat(2, 100, 10000),
            'transaction_date' => now()->toDateString(),
        ];
    }

    public function usage(): static
    {
        return $this->state(fn (array $attributes) => [
            'entry_type' => StockEntryType::Usage->value,
            'quantity' => -abs($attributes['quantity'] ?? fake()->randomFloat(2, 10, 100)),
        ]);
    }
}
