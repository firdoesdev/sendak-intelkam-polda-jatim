<?php

namespace App\Http\Requests;

use App\Enums\DocumentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PermitDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'document_type' => ['required', 'string', Rule::enum(DocumentType::class)],
            'document' => [
                'required',
                'file',
                'max:2048', // 2MB in kilobytes
                'mimes:pdf,jpg,jpeg,png',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'document.max' => 'Ukuran file maksimal 2MB',
            'document.mimes' => 'Format file harus PDF, JPG, JPEG, atau PNG',
            'document_type.required' => 'Tipe dokumen wajib diisi',
        ];
    }
}
