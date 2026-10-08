<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * A booking with its contact details and demo payment. The card fields are
 * only checked for their shape, to make the prototype feel real: they are
 * never stored, and choosing PayPal skips them.
 */
class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        // Contact details left out default to those of the account.
        [$firstName, $lastName] = array_pad(explode(' ', (string) $this->user()?->name, 2), 2, '');

        $this->mergeIfMissing([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $this->user()?->email,
            'phone' => $this->user()?->phone,
            'payment_method' => 'card',
        ]);

        $this->merge(['card_number' => preg_replace('/\s+/', '', $this->string('card_number')->toString())]);
    }

    /**
     * @return array<string, list<object|string>>
     */
    public function rules(): array
    {
        return [
            'seats' => ['required', 'integer', 'min:1', 'max:20'],
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'payment_method' => ['required', 'in:card,paypal'],
            'card_name' => ['exclude_unless:payment_method,card', 'required', 'string', 'max:255'],
            'card_number' => ['exclude_unless:payment_method,card', 'required', 'digits:16'],
            'card_expiry' => ['exclude_unless:payment_method,card', 'required', 'date_format:m/y', 'after_or_equal:'.now()->startOfMonth()->format('m/y')],
            'card_cvc' => ['exclude_unless:payment_method,card', 'required', 'digits:3'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'seats' => 'nombre de places',
            'first_name' => 'prénom',
            'last_name' => 'nom',
            'email' => 'adresse mail',
            'phone' => 'téléphone',
            'payment_method' => 'mode de paiement',
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
