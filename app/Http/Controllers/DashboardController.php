<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\BookingResource;
use App\Http\Resources\InquiryResource;
use App\Http\Resources\PodcastResource;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * The customer account: bookings for individuals, quote requests for companies.
     */
    public function show(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $bookings = $user->bookings()
            ->with('session.experience')
            ->get()
            ->sortByDesc(fn (Booking $booking) => $booking->session->starts_at)
            ->values();

        return Inertia::render('dashboard', [
            'account' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'company' => $user->company,
                'type' => ['value' => $user->account_type->value, 'label' => $user->account_type->getLabel()],
                'can_book_online' => $user->canBookOnline(),
                // Back-office accounts get a link to it from their dashboard.
                'admin_url' => $user->isAdmin() ? route('filament.admin.pages.dashboard') : null,
                'member_since' => $user->created_at?->toDateString(),
            ],
            'favoritePodcasts' => PodcastResource::collection(
                $user->favoritePodcasts()->published()->with('speaker')->get(),
            )->resolve($request),
            'bookings' => BookingResource::collection($bookings)->resolve($request),
            'inquiries' => InquiryResource::collection(
                $user->inquiries()->latest()->get(),
            )->resolve($request),
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->update($request->validated());

        Inertia::flash('success', 'Vos informations sont à jour.');

        return to_route('dashboard');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ], attributes: [
            'current_password' => 'mot de passe actuel',
            'password' => 'nouveau mot de passe',
        ]);

        /** @var User $user */
        $user = $request->user();
        $user->update(['password' => $validated['password']]);

        Inertia::flash('success', 'Votre mot de passe a été modifié.');

        return to_route('dashboard');
    }
}
