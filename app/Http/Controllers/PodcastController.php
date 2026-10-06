<?php

namespace App\Http\Controllers;

use App\Http\Resources\PodcastResource;
use App\Models\Podcast;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PodcastController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('podcasts/index', [
            'podcasts' => PodcastResource::collection(
                Podcast::query()->orderByDesc('season')->orderByDesc('number')->latest('published_at')->get(),
            )->resolve($request),
        ]);
    }

    public function show(Request $request, Podcast $podcast): Response
    {
        return Inertia::render('podcasts/show', [
            'podcast' => PodcastResource::make($podcast)->resolve($request),
        ]);
    }

    /**
     * The B2B offers built around the podcast: sponsoring, studio, events.
     */
    public function offers(): Response
    {
        return Inertia::render('podcasts/offers');
    }
}
