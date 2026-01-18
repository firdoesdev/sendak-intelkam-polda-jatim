<?php

namespace Database\Factories;

use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Warehouse>
 */
class WarehouseFactory extends Factory
{
    protected $model = Warehouse::class;

    public function definition(): array
    {
        return [
            'code' => fake()->unique()->regexify('[A-Z]{3}-[0-9]{3}'),
            'name' => fake()->company() . ' Warehouse',
            'storage_type' => 'POLICE_UNIT',
            'address' => fake()->address(),
            'city' => fake()->city(),
            'province' => fake()->state(),
            'is_active' => true,
        ];
    }
}
