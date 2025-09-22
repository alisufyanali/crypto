<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockRequest extends FormRequest
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
            'company_id' => [
                'required',
                'exists:companies,id',
                // Ensure no duplicate stock entry for the same company on the same day
                Rule::unique('stocks', 'company_id')->where(function ($query) {
                    return $query->whereDate('created_at', today());
                })
            ],
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
            'company_id.unique' => 'A stock entry already exists for this company today. Please update the existing entry instead.',
            'current_price.required' => 'Current price is required.',
            'current_price.min' => 'Current price must be at least RWF 0.01.',
            'day_high.gte' => 'Day high must be greater than or equal to day low.',
            'day_low.lte' => 'Day low must be less than or equal to day high.',
            'volume.min' => 'Volume cannot be negative.',
            'change_percentage.between' => 'Change percentage must be between -100% and 1000%.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Additional custom validation
            if ($this->filled(['current_price', 'previous_close'])) {
                $currentPrice = (float) $this->current_price;
                $previousClose = (float) $this->previous_close;
                
                // Validate reasonable price change (optional business rule)
                if ($previousClose > 0) {
                    $changePercentage = abs(($currentPrice - $previousClose) / $previousClose * 100);
                    if ($changePercentage > 50) { // More than 50% change might be suspicious
                        $validator->errors()->add('current_price', 
                            'Price change exceeds 50%. Please verify the current price is correct.');
                    }
                }
            }

            // Validate that current price is within day range
            if ($this->filled(['current_price', 'day_high', 'day_low'])) {
                $currentPrice = (float) $this->current_price;
                $dayHigh = (float) $this->day_high;
                $dayLow = (float) $this->day_low;
                
                if ($currentPrice > $dayHigh || $currentPrice < $dayLow) {
                    $validator->errors()->add('current_price', 
                        'Current price must be within the day high and low range.');
                }
            }
        });
    }
    
}
