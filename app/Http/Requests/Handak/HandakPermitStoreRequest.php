<?php

namespace App\Http\Requests\Handak;

use App\Enums\HandakReferenceType;
use App\Enums\PermitStatus;
use App\Enums\RecommendationType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HandakPermitStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create-handak-permits') ?? false;
    }

    public function rules(): array
    {
        return [
            'division_id' => ['required', 'exists:divisions,id'],
            'applicant_id' => ['required', 'exists:applicants,id'],
            'recommendation_type' => ['required', Rule::enum(RecommendationType::class)],
            'parent_permit_id' => [
                Rule::requiredIf(in_array($this->input('recommendation_type'), [RecommendationType::P1->value, RecommendationType::P2->value], true)),
                'nullable',
                'exists:permits,id',
            ],
            'warehouse_id' => [
                Rule::requiredIf($this->input('recommendation_type') === RecommendationType::IJIN_GUDANG->value),
                'nullable',
                'exists:warehouses,id',
            ],
            'status' => ['nullable', Rule::in([PermitStatus::DRAFT->value, PermitStatus::PENDING->value])],
            'valid_from' => [
                Rule::requiredIf($this->input('recommendation_type') === RecommendationType::IJIN_GUDANG->value),
                'nullable',
                'date',
            ],
            'valid_to' => [
                Rule::requiredIf($this->input('recommendation_type') === RecommendationType::IJIN_GUDANG->value),
                'nullable',
                'date',
                'after:valid_from',
            ],
            'representative_name' => ['nullable', 'string', 'max:255'],
            'representative_title' => ['nullable', 'string', 'max:255'],
            'representative_nationality' => ['nullable', 'string', 'max:255'],
            'purpose' => ['nullable', 'string'],
            'activity_location' => ['nullable', 'string', 'max:255'],
            'materials' => ['required', 'array', 'min:1'],
            'materials.*.material_type' => ['required', 'string', 'max:255'],
            'materials.*.item_name' => ['required', 'string', 'max:255'],
            'materials.*.weight' => ['required', 'numeric', 'min:0.01'],
            'materials.*.quantity' => ['required', 'integer', 'min:1'],
            'materials.*.unit' => ['required', 'string', 'max:20'],
            'materials.*.notes' => ['nullable', 'string'],
            'references' => ['nullable', 'array'],
            'references.*.reference_type' => ['required', Rule::enum(HandakReferenceType::class)],
            'references.*.document_number' => ['required', 'string', 'max:255'],
            'references.*.document_date' => ['nullable', 'date'],
            'references.*.issuer' => ['nullable', 'string', 'max:255'],
            'references.*.notes' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'parent_permit_id.required' => 'Rekom P1/P2 wajib merujuk rekom P3 sebagai induk.',
            'warehouse_id.required' => 'Ijin Gudang wajib memilih gudang penyimpanan.',
            'valid_from.required' => 'Masa berlaku Ijin Gudang wajib diisi manual.',
            'valid_to.required' => 'Masa berlaku Ijin Gudang wajib diisi manual sesuai rekomendasi instansi terkait.',
            'materials.required' => 'Minimal satu jenis bahan peledak wajib diisi.',
        ];
    }
}
