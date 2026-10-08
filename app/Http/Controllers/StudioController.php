<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class StudioController extends Controller
{
    /**
     * The podcast production studio: three steps from the idea to the release.
     */
    public function __invoke(): Response
    {
        return Inertia::render('studio');
    }
}
