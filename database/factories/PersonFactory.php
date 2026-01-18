<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PersonFactory extends Factory
{

    public function definition(): array
    {
        return [
            'national_id' => $this->faker->numerify('###############'),
            'full_name' => $this->faker->name(),
            'birth_date' => $this->faker->date(),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'job_title' => $this->faker->jobTitle(),
            'address' => $this->faker->address(),
            'city' => $this->faker->city(),
            'province' => $this->faker->state(),
        ];
    }
}
