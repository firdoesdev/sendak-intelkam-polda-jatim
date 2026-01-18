<?php

namespace Database\Factories;

use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Organization>
 */
class OrganizationFactory extends Factory
{
    protected $model = Organization::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'org_type' => fake()->randomElement(['company', 'club', 'government', 'other']),
            'registration_no' => fake()->numerify('##########'),
            'tax_no' => fake()->numerify('###############'),
            'address' => fake()->address(),
            'city' => fake()->city(),
            'province' => fake()->state(),
            'email' => fake()->companyEmail(),
        ];
    }
}
