<?php

namespace App\Http\Requests\MasterData;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\WarehouseStorageType;

class WarehouseUpdateRequest extends FormRequest
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
            'code' => 'required|string|unique:warehouses,code,' . $this->route('warehouse'),
            'name' => 'required|string',
            'storage_type' => 'required|in:' . implode(',', WarehouseStorageType::getWarehouseStorageTypes()),
            'police_unit_id' => 'required|exists:police_units,id',
            'organization_id' => 'nullable|exists:organizations,id',
            'address' => 'required|string',
            'city' => 'required|string',
            'province' => 'required|string',
            'is_active' => 'boolean',
        ];
    }
}
