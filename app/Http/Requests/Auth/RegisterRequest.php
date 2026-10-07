<?php

namespace App\Http\Requests\Auth;

use App\Enums\AccountType;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * The company field is hidden for individuals, but a value typed before
     * switching type would still be sent.
     */
    protected function prepareForValidation(): void
    {
        $this->merge(['email' => $this->string('email')->lower()->trim()->toString()]);

        if ($this->input('account_type') !== AccountType::Company->value) {
            $this->merge(['company' => null]);
        }
    }

    /**
     * @return array<string, list<object|string>>
     */
    public function rules(): array
    {
        return [
            'account_type' => ['required', Rule::enum(AccountType::class)],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique(User::class)],
            'phone' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'required_if:account_type,'.AccountType::Company->value, 'string', 'max:255'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'account_type' => 'type de compte',
            'name' => 'nom',
            'email' => 'e-mail',
            'phone' => 'téléphone',
            'company' => 'structure',
            'password' => 'mot de passe',
        ];
    }
}
