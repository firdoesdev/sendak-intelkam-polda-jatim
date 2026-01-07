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
            'issue_date' => ['required', 'date'],
            'expiry_date' => ['required', 'date', 'after:issue_date'],
        ];
    }

    public function messages(): array
    {
        return [
            'permit_id.required' => 'Izin wajib dipilih',
            'permit_id.exists' => 'Izin tidak ditemukan',
            'person_id.required' => 'Pemegang kartu wajib dipilih',
            'person_id.exists' => 'Pemegang kartu tidak ditemukan',
            'weapon_id.required' => 'Senjata api wajib dipilih',
            'weapon_id.exists' => 'Senjata api tidak ditemukan',
            'issue_date.required' => 'Tanggal penerbitan wajib diisi',
            'issue_date.date' => 'Format tanggal penerbitan tidak valid',
            'expiry_date.required' => 'Tanggal kadaluarsa wajib diisi',
            'expiry_date.date' => 'Format tanggal kadaluarsa tidak valid',
            'expiry_date.after' => 'Tanggal kadaluarsa harus setelah tanggal penerbitan',
        ];
    }
}
