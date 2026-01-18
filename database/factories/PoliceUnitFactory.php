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
            'code' => $this->faker->unique()->bothify('PU-####'),
            'name' => $this->faker->company(),
            'unit_type' => $this->faker->randomElement(PoliceUnitType::getUnitTypes()),
            'region' => $this->faker->city(),
            'address' => $this->faker->address(),
            'is_active' => $this->faker->boolean(90), // 90% chance of being active
            'created_at' => now(),
            'updated_at' => now(),

        ];
    }
}
