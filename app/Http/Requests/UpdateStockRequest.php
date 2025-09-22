<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStockRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->role === 'admin' || $this->user()->role === 'broker';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'current_price' => 'required|numeric|min:0.01|max:999999999.99',
            'previous_close' => 'nullable|numeric|min:0|max:999999999.99',
            'day_high' => 'nullable|numeric|min:0|max:999999999.99|gte:day_low',
            'day_low' => 'nullable|numeric|min:0|max:999999999.99|lte:day_high',
            'volume' => 'nullable|integer|min:0|max:9999999999',
            'change_amount' => 'nullable|numeric',
            'change_percentage' => 'nullable|numeric|between:-100,1000',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'current_price.required' => 'Current price is required.',
            'current_price.min' => 'Current price must be at least RWF 0.01.',
            'day_high.gte' => 'Day high must be greater than or equal to day low.',
            'day_low.lte' => 'Day low must be less than or equal to day high.',
            'volume.min' => 'Volume cannot be negative.',
            'change_percentage.between' => 'Change percentage must be between -100% and 1000%.',
        ];
    }
    
}
