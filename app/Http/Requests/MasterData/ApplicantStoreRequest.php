<?php

namespace App\Http\Requests\MasterData;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApplicantStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'applicant_type' => ['required', Rule::in(['person', 'organization'])],
            'person_id' => [
                'nullable',
                'required_if:applicant_type,person',
                'exists:persons,id'
            ],
            'organization_id' => [
                'nullable',
                'required_if:applicant_type,organization',
                'exists:organizations,id'
            ],
            'display_name' => 'nullable|string|max:255',
        ];
    }
}
