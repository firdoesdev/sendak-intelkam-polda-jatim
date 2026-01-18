<?php

namespace Database\Factories;

use App\Models\Applicant;
use App\Models\Person;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Applicant>
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
}
