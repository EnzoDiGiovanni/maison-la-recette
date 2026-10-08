<?php

namespace App\Http\Controllers;

use App\Enums\ExperienceType;
use App\Enums\SessionStatus;
use App\Http\Resources\ExperienceResource;
use App\Http\Resources\ExperienceSessionResource;
use App\Http\Resources\TestimonialResource;
use App\Models\Experience;
use App\Models\ExperienceSession;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExperienceController extends Controller
{
    /**
     * The menu of the experiences: companies on one side, the formats open
     * to everyone on the other.
     */
    public function index(Request $request): Response
    {
        $experiences = Experience::query()->published()->get();
        $spotlight = $experiences->firstWhere('cover_image', '!=', null) ?? $experiences->first();

        return Inertia::render('experiences/index', [
            // Only the formats that have something published.
            'types' => collect(ExperienceType::cases())
                ->filter(fn (ExperienceType $type): bool => $experiences->contains('type', $type))
                ->map(fn (ExperienceType $type): array => ['slug' => $type->slug(), 'label' => $type->pluralLabel()])
                ->values()
                ->all(),
            // The experience whose photo illustrates the menu.
            'spotlight' => $spotlight === null ? null : ExperienceResource::make($spotlight)->resolve($request),
        ]);
    }

    /**
     * Every upcoming date, whatever the format.
     */
    public function agenda(Request $request): Response
    {
        return $this->renderListing($request, null);
    }

    public function listing(Request $request, string $type): Response
    {
        return $this->renderListing($request, ExperienceType::fromSlug($type));
    }

    /**
     * Upcoming dates, past dates and reviews of one format, or of all of
     * them when no type is given.
     */
    private function renderListing(Request $request, ?ExperienceType $type): Response
    {
        $published = fn (Builder $query) => $query
            ->where('is_published', true)
            ->when($type, fn (Builder $query) => $query->where('type', $type));

        $withExperience = fn (ExperienceSession $session): array => [
            ...ExperienceSessionResource::make($session)->resolve($request),
            'experience' => ExperienceResource::make($session->experience)->resolve($request),
        ];

        return Inertia::render('experiences/listing', [
            'type' => $type === null ? null : [
                'value' => $type->value,
                'slug' => $type->slug(),
                'label' => $type->pluralLabel(),
            ],
            'sessions' => ExperienceSession::query()
                ->with('experience')
                ->whereHas('experience', $published)
                ->upcoming()
                ->get()
                ->map($withExperience)
                ->all(),
            // Dates that already took place, the most recent first.
            'pastEvents' => ExperienceSession::query()
                ->with('experience')
                ->whereHas('experience', $published)
                ->where('status', '!=', SessionStatus::Cancelled)
                ->where('starts_at', '<', now())
                ->latest('starts_at')
                ->limit(12)
                ->get()
                ->map(fn (ExperienceSession $session): array => [
                    'id' => $session->id,
                    'starts_at' => $session->starts_at->toIso8601String(),
                    'experience' => ExperienceResource::make($session->experience)->resolve($request),
                ])
                ->all(),
            'testimonials' => TestimonialResource::collection(
                Testimonial::query()
                    ->with('experience')
                    ->published()
                    ->when($type, fn (Builder $query) => $query->forType($type))
                    ->get(),
            )->resolve($request),
        ]);
    }
}
