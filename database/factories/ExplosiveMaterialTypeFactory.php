<?php

namespace Database\Factories;

use App\Models\ExplosiveMaterialType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ExplosiveMaterialType>
 */
class ExplosiveMaterialTypeFactory extends Factory
{
    protected $model = ExplosiveMaterialType::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'default_unit' => fake()->randomElement(['kg', 'm', 'pcs']),
            'is_active' => true,
        ];
    }
}
