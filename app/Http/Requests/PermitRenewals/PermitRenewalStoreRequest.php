<?php

namespace App\Http\Requests\PermitRenewals;

use Illuminate\Foundation\Http\FormRequest;

class PermitRenewalStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('request-permit-renewal');
    }

    public function rules(): array
    {
        return [
            'permit_id' => 'required|exists:permits,id',
            'current_valid_to' => 'required|date',
            'new_valid_to' => 'required|date|after:current_valid_to',
            'status' => 'required|in:draft,pending',
            'reason' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'new_valid_to.after' => 'Tanggal berlaku baru harus setelah tanggal berlaku saat ini.',
        ];
    }
}
