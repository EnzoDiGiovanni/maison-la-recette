<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    /**
     * The text and photo come from the shared `settings` prop.
     */
    public function __invoke(): Response
    {
        return Inertia::render('about');
    }
}
