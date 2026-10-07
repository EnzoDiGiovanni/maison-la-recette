<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// New accounts are plain users: this gives one of them the back office.
Artisan::command('user:admin {email}', function (string $email) {
    $user = User::query()->where('email', $email)->first();

    if ($user === null) {
        $this->error("Aucun compte avec l'e-mail {$email}.");

        return 1;
    }

    $user->role = UserRole::Admin;
    $user->save();

    $this->info("{$email} a maintenant le rôle admin.");

    return 0;
})->purpose('Give the admin role to an existing account');
