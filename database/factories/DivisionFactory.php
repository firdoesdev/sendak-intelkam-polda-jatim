<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DivisionFactory extends Factory
{


    public function definition(): array
    {
        return [
            'code' => fake()->randomElement(['SENPI', 'SPORT', 'POLSUS', 'HANDAK']),
            'name' => fake()->word(),
            'description' => fake()->sentence(),
            'is_active' => true,
        ];
    }
}
