<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DivisionFactory extends Factory
{


    public function definition(): array
    {
        return [
            'code' => $this->faker->randomElement(['SENPI', 'SPORT', 'POLSUS', 'HANDAK']),
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'is_active' => true,
        ];
    }
}
