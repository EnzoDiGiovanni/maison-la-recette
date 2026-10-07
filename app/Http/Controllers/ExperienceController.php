<?php

namespace App\Http\Controllers;

use App\Enums\SessionStatus;
use App\Http\Resources\ExperienceResource;
use App\Http\Resources\ExperienceSessionResource;
use App\Http\Resources\TestimonialResource;
use App\Models\Experience;
use App\Models\ExperienceSession;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExperienceController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('experiences/index', [
            // The three most recently added experiences, whatever their type.
            'latestExperiences' => Experience::query()
                ->where('is_published', true)
                ->latest()
                ->latest('id')
                ->limit(3)
                ->with('upcomingSessions')
                ->get()
                ->map(fn (Experience $experience): array => [
                    ...ExperienceResource::make($experience)->resolve($request),
                    'next_session_at' => $experience->upcomingSessions->first()?->starts_at->toIso8601String(),
                ])
                ->all(),
            // Dates that already took place, the most recent first.
            'pastEvents' => ExperienceSession::query()
                ->with('experience')
                ->whereRelation('experience', 'is_published', true)
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
        ]);
    }

    public function show(Request $request, Experience $experience): Response
    {
        abort_unless($experience->is_published, 404);

        return Inertia::render('experiences/show', [
            'experience' => ExperienceResource::make($experience)->resolve($request),
            'sessions' => ExperienceSessionResource::collection(
                $experience->sessions()->upcoming()->get(),
            )->resolve($request),
            'testimonials' => TestimonialResource::collection(
                Testimonial::query()
                    ->published()
                    ->where(fn ($query) => $query->whereNull('experience_type')->orWhere('experience_type', $experience->type))
                    ->get(),
            )->resolve($request),
        ]);
    }
}
