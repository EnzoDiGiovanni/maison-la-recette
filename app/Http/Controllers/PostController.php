<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('posts/index', [
            'posts' => PostResource::collection(
                Post::query()->published()->get(),
            )->resolve($request),
        ]);
    }

    public function show(Request $request, Post $post): Response
    {
        abort_unless($post->published_at?->isPast() ?? false, 404);

        return Inertia::render('posts/show', [
            'post' => PostResource::make($post)->resolve($request),
        ]);
    }
}
