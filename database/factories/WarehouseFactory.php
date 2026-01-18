<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class WarehouseFactory extends Factory
{
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
