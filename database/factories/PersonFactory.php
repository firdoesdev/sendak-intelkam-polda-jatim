<?php

namespace Database\Factories;

use App\Models\Person;
use Illuminate\Database\Eloquent\Factories\Factory;

class PersonFactory extends Factory
{
    protected $model = Person::class;

    public function definition(): array
    {
        return [
            'national_id' => fake()->numerify('###############'),
            'full_name' => fake()->name(),
            'birth_date' => fake()->date(),
            'gender' => fake()->randomElement(['male', 'female']),
            'job_title' => fake()->jobTitle(),
            'address' => fake()->address(),
            'city' => fake()->city(),
            'province' => fake()->state(),
        ];
    }
}
