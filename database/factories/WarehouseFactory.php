<?php

namespace Database\Factories;

use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

class WarehouseFactory extends Factory
{
    protected $model = Warehouse::class;

    public function definition(): array
    {
        return [
            'code' => $this->faker->unique()->regexify('[A-Z]{3}-[0-9]{3}'),
            'name' => $this->faker->company() . ' Warehouse',
            'storage_type' => 'POLICE_UNIT',
            'address' => $this->faker->address(),
            'city' => $this->faker->city(),
            'province' => $this->faker->state(),
            'is_active' => true,
        ];
    }
}
