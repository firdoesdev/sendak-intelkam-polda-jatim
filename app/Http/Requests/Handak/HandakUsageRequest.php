<?php

namespace App\Http\Requests\Handak;

use Illuminate\Foundation\Http\FormRequest;

class HandakUsageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('record-handak-usage') ?? false;
    }

    public function rules(): array
    {
        return [
            'usages' => ['required', 'array', 'min:1'],
            'usages.*.material_type' => ['required', 'string', 'max:255'],
            'usages.*.unit' => ['required', 'string', 'max:20'],
            'usages.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'usages.*.notes' => ['nullable', 'string'],
        ];
    }
}
