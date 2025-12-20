<?php

namespace App\Http\Requests\MasterData;

use Illuminate\Foundation\Http\FormRequest;

class PersonStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'national_id' => 'nullable|string|max:255',
            'full_name' => 'required|string|max:255',
            'birth_date' => 'nullable|date',
            'gender' => 'required|in:male,female,unknown',
            'job_title' => 'nullable|string|max:255',
            'rank' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'police_unit_id' => 'nullable|exists:police_units,id',
            'organization_id' => 'nullable|exists:organizations,id',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ];
    }
}
