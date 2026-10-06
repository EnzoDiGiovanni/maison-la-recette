<?php

namespace App\Http\Controllers;

use App\Http\Resources\ExperienceResource;
use App\Http\Resources\ExperienceSessionResource;
use App\Http\Resources\TestimonialResource;
use App\Models\Experience;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExperienceController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('experiences/index', [
            'experiences' => ExperienceResource::collection(
                Experience::query()->published()->get(),
            )->resolve($request),
            'testimonials' => TestimonialResource::collection(
                Testimonial::query()->published()->get(),
            )->resolve($request),
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
