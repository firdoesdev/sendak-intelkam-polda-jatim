<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApproveHibahTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'in:approve,reject'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'action.required' => 'Aksi wajib dipilih (approve/reject)',
            'action.in' => 'Aksi harus approve atau reject',
            'notes.max' => 'Catatan maksimal 1000 karakter',
        ];
    }
}
