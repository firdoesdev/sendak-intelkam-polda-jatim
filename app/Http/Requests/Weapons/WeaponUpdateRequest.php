<?php

namespace App\Http\Requests\Weapons;

use App\Enums\PermitType;
use App\Enums\WeaponCondition;
use App\Enums\WeaponStatus;
use Illuminate\Foundation\Http\FormRequest;

class WeaponUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('edit-weapons');
    }

    public function rules(): array
    {
        $weaponId = $this->route('weapon');

        return [
            'code' => 'required|string|unique:weapons,code,'.$weaponId,
            'name' => 'required|string|max:255',
            'permit_type' => 'required|in:'.implode(',', PermitType::getPermitTypes()),
            'weapon_type' => 'nullable|string|max:255',
            'serial_number' => 'required|string|unique:weapons,serial_number,'.$weaponId,
            'manufacturer' => 'nullable|string|max:255',
            'caliber' => 'nullable|string|max:255',
            'acquisition_date' => 'nullable|date',
            'condition' => 'required|in:'.implode(',', WeaponCondition::getWeaponConditions()),
            'status' => 'required|in:'.implode(',', WeaponStatus::getWeaponStatuses()),
            'warehouse_id' => 'required|exists:warehouses,id',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
        ];
    }
}
