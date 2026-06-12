<?php

namespace App\Http\Requests\Handak;

use App\Enums\HandakReferenceType;
use App\Enums\PermitStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HandakPermitUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('edit-handak-permits') ?? false;
    }

    public function rules(): array
    {
        return [
            'applicant_id' => ['sometimes', 'exists:applicants,id'],
            'warehouse_id' => ['nullable', 'exists:warehouses,id'],
            'status' => ['nullable', Rule::in([PermitStatus::DRAFT->value, PermitStatus::PENDING->value, PermitStatus::CANCELLED->value])],
            'valid_from' => ['nullable', 'date'],
            'valid_to' => ['nullable', 'date', 'after:valid_from'],
            'representative_name' => ['nullable', 'string', 'max:255'],
            'representative_title' => ['nullable', 'string', 'max:255'],
            'representative_nationality' => ['nullable', 'string', 'max:255'],
            'purpose' => ['nullable', 'string'],
            'activity_location' => ['nullable', 'string', 'max:255'],
            'materials' => ['sometimes', 'array', 'min:1'],
            'materials.*.material_type' => ['required', 'string', 'max:255'],
            'materials.*.item_name' => ['required', 'string', 'max:255'],
            'materials.*.weight' => ['required', 'numeric', 'min:0.01'],
            'materials.*.quantity' => ['required', 'integer', 'min:1'],
            'materials.*.unit' => ['required', 'string', 'max:20'],
            'materials.*.notes' => ['nullable', 'string'],
            'references' => ['sometimes', 'array'],
            'references.*.reference_type' => ['required', Rule::enum(HandakReferenceType::class)],
            'references.*.document_number' => ['required', 'string', 'max:255'],
            'references.*.document_date' => ['nullable', 'date'],
            'references.*.issuer' => ['nullable', 'string', 'max:255'],
            'references.*.notes' => ['nullable', 'string'],
        ];
    }
}
