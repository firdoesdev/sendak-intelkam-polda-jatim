<?php

namespace App\Http\Requests\MasterData;

use Illuminate\Foundation\Http\FormRequest;

class PoliceUnitUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'code' => 'required|string|unique:police_units,code,' . $this->route('police_unit'),
            'name' => 'required|string',
            'unit_type' => 'required|in:' . implode(',', \App\Enums\PoliceUnitType::getUnitTypes()),
            'region' => 'nullable|string',
            'address' => 'nullable|string',
            'parent_id' => 'nullable|exists:police_units,id',
            'is_active' => 'boolean',
        ];
    }
}
