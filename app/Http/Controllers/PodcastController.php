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
                Podcast::query()->published()->with('speaker')->latest('published_at')->latest('id')->get(),
            )->resolve($request),
        ]);
    }

    public function show(Request $request, Podcast $podcast): Response
    {
        abort_unless($podcast->is_published, 404);

        return Inertia::render('podcasts/show', [
            'podcast' => PodcastResource::make($podcast)->resolve($request),
            'otherPodcasts' => PodcastResource::collection(
                Podcast::query()->published()->with('speaker')->whereKeyNot($podcast->getKey())->latest('published_at')->latest('id')->limit(6)->get(),
            )->resolve($request),
        ]);
    }
}
