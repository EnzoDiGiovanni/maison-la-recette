<?php

namespace App\Http\Requests;

use App\Enums\AccountType;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['email' => $this->string('email')->lower()->trim()->toString()]);

        if ($this->user()?->account_type !== AccountType::Company) {
            $this->merge(['company' => null]);
        }
    }

    /**
     * @return array<string, list<object|string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user())],
            'phone' => ['nullable', 'string', 'max:255'],
            'company' => [$this->user()?->account_type === AccountType::Company ? 'required' : 'nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nom',
            'email' => 'e-mail',
            'phone' => 'téléphone',
            'company' => 'structure',
        ];
    }
}
