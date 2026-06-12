<?php

namespace Database\Factories;

use App\Enums\HandakReferenceType;
use App\Models\HandakPermitReference;
use App\Models\Permit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HandakPermitReference>
 */
class HandakPermitReferenceFactory extends Factory
{
    protected $model = HandakPermitReference::class;

    public function definition(): array
    {
        return [
            'permit_id' => Permit::factory(),
            'reference_type' => fake()->randomElement(HandakReferenceType::getReferenceTypes()),
            'document_number' => fake()->unique()->numerify('##/PLP.DIR/AGR/X/####'),
            'document_date' => fake()->dateTimeBetween('-1 year')->format('Y-m-d'),
            'issuer' => fake()->company(),
        ];
    }
}
