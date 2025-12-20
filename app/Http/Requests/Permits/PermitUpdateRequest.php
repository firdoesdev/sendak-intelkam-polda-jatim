<?php

namespace App\Http\Requests\Permits;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PermitUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'division_id' => 'required|exists:divisions,id',
            'applicant_id' => 'required|exists:applicants,id',
            'permit_type' => ['required', Rule::in(['SENPI', 'POLSUS', 'HANDAK', 'SPORT'])],
            'status' => [
                'required',
                Rule::in(['draft', 'pending', 'approved', 'rejected', 'expired', 'cancelled'])
            ],
            'valid_from' => 'nullable|date',
            'valid_to' => 'nullable|date|after:valid_from',
        ];
    }
}
