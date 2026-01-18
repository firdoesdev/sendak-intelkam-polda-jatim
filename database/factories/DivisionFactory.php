<?php

namespace Database\Factories;

use App\Models\Division;
use Illuminate\Database\Eloquent\Factories\Factory;

class DivisionFactory extends Factory
{
    protected $model = Division::class;

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
