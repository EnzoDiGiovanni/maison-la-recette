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
     * Simple contact page. Old ?type=devis_* links land on the right quote form.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        $type = InquiryType::tryFrom($request->string('type')->toString());

        return match ($type) {
            InquiryType::ExperienceQuote => to_route('contact.quote.experience'),
            InquiryType::PodcastQuote => to_route('contact.quote.podcast'),
            default => Inertia::render('contact'),
        };
    }

    public function createExperienceQuote(Request $request): Response
    {
        return $this->renderQuote(InquiryType::ExperienceQuote, $request);
    }

    public function createPodcastQuote(): Response
    {
        return $this->renderQuote(InquiryType::PodcastQuote);
    }

    private function renderQuote(InquiryType $type, ?Request $request = null): Response
    {
        return Inertia::render('contact-quote', [
            'type' => $type->value,
            'defaultExperienceType' => $request
                ? ExperienceType::tryFrom($request->string('experience_type')->toString())?->value
                : null,
            'experienceTypes' => array_map(
                fn (ExperienceType $case): array => ['value' => $case->value, 'label' => $case->getLabel()],
                ExperienceType::cases(),
            ),
        ]);
    }

    public function store(StoreInquiryRequest $request): RedirectResponse
    {
        // Sent from an account: the request then shows up in the customer's dashboard.
        Inquiry::query()->create([...$request->validated(), 'user_id' => $request->user()?->id]);

        Inertia::flash('success', 'Merci ! Votre message a bien été envoyé. Nous vous répondons sous 48 h.');

        return back();
    }
}
