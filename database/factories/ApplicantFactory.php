<?php

namespace Database\Factories;

use App\Models\Person;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicantFactory extends Factory
{

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
