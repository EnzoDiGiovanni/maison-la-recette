<?php

namespace App\Http\Controllers;

use App\Enums\ExperienceType;
use App\Enums\InquiryType;
use App\Http\Requests\StoreInquiryRequest;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    /**
     * The contact page, also used for quote requests (?type=devis_experience).
     */
    public function create(Request $request): Response
    {
        $type = InquiryType::tryFrom($request->string('type')->toString()) ?? InquiryType::Contact;

        return Inertia::render('contact', [
            'defaultType' => $type->value,
            'defaultExperienceType' => ExperienceType::tryFrom($request->string('experience_type')->toString())?->value,
            'inquiryTypes' => array_map(
                fn (InquiryType $case): array => ['value' => $case->value, 'label' => $case->getLabel()],
                InquiryType::cases(),
            ),
            'experienceTypes' => array_map(
                fn (ExperienceType $case): array => ['value' => $case->value, 'label' => $case->getLabel()],
                ExperienceType::cases(),
            ),
        ]);
    }

    public function store(StoreInquiryRequest $request): RedirectResponse
    {
        Inquiry::query()->create($request->validated());

        Inertia::flash('success', 'Merci ! Votre message a bien été envoyé. Nous vous répondons sous 48 h.');

        return to_route('contact');
    }
}
