<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\WeaponHibahTransferRequest as HibahTransferModel;

class ApproveHibahTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Get the transfer from route parameter
        $transfer = $this->route('transfer');
        return $this->user()->can('approve', $transfer);
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
