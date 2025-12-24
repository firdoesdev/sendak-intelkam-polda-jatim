<?php

namespace App\Http\Requests\Weapons;

use Illuminate\Foundation\Http\FormRequest;

class TransferRequestStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // TODO: Add permission check
    }

    public function rules(): array
    {
        return [
            'weapon_id' => 'required|exists:weapons,id',
            'from_warehouse_id' => 'required|exists:warehouses,id',
            'to_warehouse_id' => 'required|exists:warehouses,id|different:from_warehouse_id',
            'status' => 'required|in:draft,pending',
            'reason' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'to_warehouse_id.different' => 'Gudang tujuan harus berbeda dengan gudang asal.',
        ];
    }
}
