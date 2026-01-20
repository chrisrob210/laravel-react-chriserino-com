<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'uri' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:255',
            'github' => 'nullable|string|max:255',
            'show_in_portfolio' => 'nullable|boolean',
            'technologies' => 'nullable|array',
            'technologies.*' => 'exists:technologies,id',
        ];
    }
}
