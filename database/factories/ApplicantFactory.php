<?php

namespace Database\Factories;

use App\Models\Applicant;
use App\Models\Organization;
use App\Models\Person;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Applicant>
 */
class ApplicantFactory extends Factory
{
    protected $model = Applicant::class;

    public function definition(): array
    {
        $person = Person::factory()->create();

        return [
            'applicant_type' => 'person',
            'person_id' => $person->id,
            'display_name' => $person->full_name,
        ];
    }

    public function organization(): static
    {
        return $this->state(function () {
            $organization = Organization::factory()->create();

            return [
                'applicant_type' => 'organization',
                'organization_id' => $organization->id,
                'display_name' => $organization->name,
            ];
        });
    }
}
