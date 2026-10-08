<?php

namespace App\Http\Controllers\Auth;

use App\Enums\AccountType;
use App\Http\Controllers\Controller;
use App\Http\Controllers\FavoritePodcastController;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register', [
            'accountTypes' => array_map(
                fn (AccountType $case): array => ['value' => $case->value, 'label' => $case->getLabel()],
                AccountType::cases(),
            ),
        ]);
    }

    public function store(RegisterRequest $request): RedirectResponse
    {
        $user = new User($request->safe()->except('account_type'));
        $user->account_type = $request->enum('account_type', AccountType::class) ?? AccountType::Individual;
        $user->save();

        Auth::login($user);
        $request->session()->regenerate();
        FavoritePodcastController::savePending($request, $user);

        Inertia::flash('success', 'Bienvenue ! Votre compte est créé.');

        return to_route('dashboard');
    }
}
