<?php

namespace App\Actions\MasterData;

use App\Models\Applicant;
use App\Models\Person;
use App\Models\Organization;

class CreateApplicant
{
    public function __construct()
    {
        //
    }

    public function execute(array $data): Applicant
    {
        // Auto-fill display_name from related Person/Organization if not provided
        if (empty($data['display_name'])) {
            if ($data['applicant_type'] === 'person' && !empty($data['person_id'])) {
                $person = Person::find($data['person_id']);
                $data['display_name'] = $person?->full_name ?? '';
            } elseif ($data['applicant_type'] === 'organization' && !empty($data['organization_id'])) {
                $organization = Organization::find($data['organization_id']);
                $data['display_name'] = $organization?->name ?? '';
            }
        }

        return Applicant::create($data);
    }
}
