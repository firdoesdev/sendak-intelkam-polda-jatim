<?php

namespace App\Http\Requests\Handak;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IssueSiNumberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('issue-handak-si') ?? false;
    }

    public function rules(): array
    {
        return [
            'si_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('permits', 'si_number')->ignore($this->route('permit')),
            ],
        ];
    }
}
