<?php

namespace App\Http\Requests\Weapons;

use App\Enums\PermitType;
use App\Enums\WeaponStatus;
use App\Enums\WeaponCondition;
use Illuminate\Foundation\Http\FormRequest;

class WeaponStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // TODO: Add permission check
    }

    public function rules(): array
    {
        return [
            'code' => 'required|string|unique:weapons,code',
            'name' => 'required|string|max:255',
            'permit_type' => 'required|in:' . implode(',', PermitType::getPermitTypes()),
            'weapon_type' => 'nullable|string|max:255',
            'serial_number' => 'required|string|unique:weapons,serial_number',
            'manufacturer' => 'nullable|string|max:255',
            'caliber' => 'nullable|string|max:255',
            'acquisition_date' => 'nullable|date',
            'condition' => 'required|in:' . implode(',', WeaponCondition::getWeaponConditions()),
            'status' => 'required|in:' . implode(',', WeaponStatus::getWeaponStatuses()),
            'warehouse_id' => 'required|exists:warehouses,id',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
        ];
    }
}
