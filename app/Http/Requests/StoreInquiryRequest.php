<?php

namespace App\Http\Requests;

use App\Enums\ExperienceType;
use App\Enums\InquiryType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Drop the fields the chosen type does not use: the form hides them, but
     * values typed before switching type would still be sent.
     */
    protected function prepareForValidation(): void
    {
        $type = InquiryType::tryFrom($this->string('type')->toString());

        $unused = match ($type) {
            InquiryType::Contact => ['company', 'experience_type', 'participants', 'desired_date', 'venue'],
            InquiryType::PodcastQuote => ['experience_type', 'participants', 'desired_date', 'venue'],
            default => [],
        };

        $this->merge(array_fill_keys($unused, null));
    }

    /**
     * @return array<string, array<int, ValidationRule|string>>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', Rule::enum(InquiryType::class)],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'experience_type' => ['nullable', Rule::enum(ExperienceType::class)],
            'participants' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'desired_date' => ['nullable', 'date', 'after:today'],
            'venue' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }
}
