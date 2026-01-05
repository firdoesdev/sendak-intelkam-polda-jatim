<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\KartuPengpin;

class GenerateKartuPengpinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', KartuPengpin::class);
    }

    public function rules(): array
    {
        return [
            'permit_id' => ['required', 'exists:permits,id'],
            'person_id' => ['required', 'exists:persons,id'],
            'weapon_id' => ['required', 'exists:weapons,id'],
            'issued_at' => ['required', 'date'],
            'expired_at' => ['required', 'date', 'after:issued_at'],
        ];
    }

    public function messages(): array
    {
        return [
            'permit_id.exists' => 'Ijin tidak ditemukan',
            'person_id.exists' => 'Pengguna tidak ditemukan',
            'weapon_id.exists' => 'Senjata tidak ditemukan',
            'issued_at.required' => 'Tanggal terbit wajib diisi',
            'expired_at.required' => 'Tanggal expired wajib diisi',
            'expired_at.after' => 'Tanggal expired harus setelah tanggal terbit',
        ];
    }
}
