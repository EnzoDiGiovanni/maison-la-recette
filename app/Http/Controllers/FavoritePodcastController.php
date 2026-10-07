<?php

namespace App\Http\Controllers;

use App\Models\Podcast;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FavoritePodcastController extends Controller
{
    private const PENDING_KEY = 'pending_favorite_podcast';

    /**
     * Add the episode to the account's « à écouter plus tard » list, or remove it.
     * A guest is sent to the login page; the episode is saved once signed in.
     */
    public function toggle(Request $request, Podcast $podcast): RedirectResponse
    {
        $user = $request->user();

        if (! $user instanceof User) {
            $request->session()->put(self::PENDING_KEY, $podcast->id);

            // After a POST, « intended » is the page the visitor came from.
            return redirect()->guest(route('login'));
        }

        $user->favoritePodcasts()->toggle($podcast);

        return back();
    }

    /**
     * Save the episode a guest bookmarked just before signing in or up.
     */
    public static function savePending(Request $request, User $user): void
    {
        $id = $request->session()->pull(self::PENDING_KEY);

        if (is_int($id) && Podcast::query()->whereKey($id)->exists()) {
            $user->favoritePodcasts()->syncWithoutDetaching([$id]);
        }
    }
}
