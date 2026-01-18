<?php

namespace Database\Factories;

use App\Enums\PoliceUnitType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PoliceUnit>
 */
class PoliceUnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'code' => fake()->unique()->bothify('PU-####'),
            'name' => fake()->company(),
            'unit_type' => fake()->randomElement(PoliceUnitType::getUnitTypes()),
            'region' => fake()->city(),
            'address' => fake()->address(),
            'is_active' => fake()->boolean(90), // 90% chance of being active
            'created_at' => now(),
            'updated_at' => now(),

        ];
    }
}
