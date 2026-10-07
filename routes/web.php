<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\FavoritePodcastController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\PodcastController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/podcasts', [PodcastController::class, 'index'])->name('podcasts.index');
Route::get('/podcasts/offres', [PodcastController::class, 'offers'])->name('podcasts.offers');
Route::get('/podcasts/{podcast:slug}', [PodcastController::class, 'show'])->name('podcasts.show');

Route::get('/experiences', [ExperienceController::class, 'index'])->name('experiences.index');
Route::get('/experiences/{experience:slug}', [ExperienceController::class, 'show'])->name('experiences.show');

Route::get('/blog', [PostController::class, 'index'])->name('posts.index');
Route::get('/blog/{post:slug}', [PostController::class, 'show'])->name('posts.show');

Route::get('/a-propos', AboutController::class)->name('about');

Route::get('/contact', [InquiryController::class, 'create'])->name('contact');
Route::get('/devis-experience', [InquiryController::class, 'createExperienceQuote'])->name('contact.quote.experience');
Route::get('/devis-podcast', [InquiryController::class, 'createPodcastQuote'])->name('contact.quote.podcast');
Route::post('/contact', [InquiryController::class, 'store'])->middleware('throttle:10,1')->name('contact.store');

// Open to guests: the controller sends them to the login page and remembers the episode.
Route::post('/podcasts/{podcast:slug}/favori', [FavoritePodcastController::class, 'toggle'])->middleware('throttle:30,1')->name('podcasts.favorite');

Route::middleware('guest')->group(function () {
    Route::get('/connexion', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/connexion', [AuthenticatedSessionController::class, 'store'])->middleware('throttle:10,1')->name('login.store');
    Route::get('/inscription', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/inscription', [RegisteredUserController::class, 'store'])->middleware('throttle:10,1')->name('register.store');
});

Route::middleware('auth')->group(function () {
    Route::post('/deconnexion', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/dashboard', [DashboardController::class, 'show'])->name('dashboard');
    Route::put('/dashboard/profil', [DashboardController::class, 'updateProfile'])->name('dashboard.profile.update');
    Route::put('/dashboard/mot-de-passe', [DashboardController::class, 'updatePassword'])->name('dashboard.password.update');
    Route::patch('/dashboard/reservations/{booking}/annuler', [BookingController::class, 'cancel'])->name('dashboard.bookings.cancel');

    Route::get('/sessions/{session}/paiement', [BookingController::class, 'create'])->name('bookings.create');
    Route::post('/sessions/{session}/reservations', [BookingController::class, 'store'])->name('bookings.store');
});
