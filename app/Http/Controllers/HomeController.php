<?php

namespace App\Http\Controllers;

use App\Http\Resources\ExperienceResource;
use App\Http\Resources\PodcastResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\TestimonialResource;
use App\Models\Experience;
use App\Models\Podcast;
use App\Models\Post;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('home', [
            'featuredPodcasts' => PodcastResource::collection(
                Podcast::query()->where('is_featured', true)->latest('published_at')->get(),
            )->resolve($request),
            'experiences' => ExperienceResource::collection(
                Experience::query()->published()->get(),
            )->resolve($request),
            'testimonials' => TestimonialResource::collection(
                Testimonial::query()->published()->get(),
            )->resolve($request),
            'latestPosts' => PostResource::collection(
                Post::query()->published()->limit(3)->get(),
            )->resolve($request),
        ]);
    }
}
