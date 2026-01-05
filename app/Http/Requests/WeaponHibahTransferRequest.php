<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WeaponHibahTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'weapon_id' => ['required', 'exists:weapons,id'],
            'from_person_id' => ['required', 'exists:persons,id'],
            'from_permit_id' => ['required', 'exists:permits,id'],
            'to_person_id' => ['required', 'exists:persons,id'],
            'to_permit_id' => ['required', 'exists:permits,id'],
            'transfer_reason' => ['required', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'weapon_id.exists' => 'Senjata tidak ditemukan',
            'from_person_id.exists' => 'Pemilik lama tidak ditemukan',
            'from_permit_id.exists' => 'Ijin pemilik lama tidak ditemukan',
            'to_person_id.exists' => 'Pemilik baru tidak ditemukan',
            'to_permit_id.exists' => 'Ijin pemilik baru tidak ditemukan',
            'transfer_reason.required' => 'Alasan hibah wajib diisi',
            'transfer_reason.max' => 'Alasan hibah maksimal 500 karakter',
        ];
    }
}
