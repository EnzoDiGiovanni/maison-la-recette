<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * A booking with its demo payment. The card fields are only checked for
 * their shape, to make the prototype feel real: they are never stored.
 */
class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['card_number' => preg_replace('/\s+/', '', $this->string('card_number')->toString())]);
    }

    /**
     * @return array<string, list<object|string>>
     */
    public function rules(): array
    {
        return [
            'seats' => ['required', 'integer', 'min:1', 'max:20'],
            'card_name' => ['required', 'string', 'max:255'],
            'card_number' => ['required', 'digits:16'],
            'card_expiry' => ['required', 'date_format:m/y', 'after_or_equal:'.now()->startOfMonth()->format('m/y')],
            'card_cvc' => ['required', 'digits:3'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'seats' => 'nombre de places',
            'card_name' => 'titulaire de la carte',
            'card_number' => 'numéro de carte',
            'card_expiry' => 'date d\'expiration',
            'card_cvc' => 'cryptogramme',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'card_number.digits' => 'Le numéro de carte doit comporter 16 chiffres.',
            'card_expiry.date_format' => 'La date d\'expiration doit être au format MM/AA.',
            'card_expiry.after_or_equal' => 'Cette carte est expirée.',
            'card_cvc.digits' => 'Le cryptogramme doit comporter 3 chiffres.',
        ];
    }
}
