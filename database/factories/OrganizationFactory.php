<?php

namespace Database\Factories;


use Illuminate\Database\Eloquent\Factories\Factory;

class OrganizationFactory extends Factory
{

    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'org_type' => $this->faker->randomElement(['company', 'club', 'government', 'other']),
            'registration_no' => $this->faker->numerify('##########'),
            'tax_no' => $this->faker->numerify('###############'),
            'address' => $this->faker->address(),
            'city' => $this->faker->city(),
            'province' => $this->faker->state(),
            'email' => $this->faker->companyEmail(),
        ];
    }
}
