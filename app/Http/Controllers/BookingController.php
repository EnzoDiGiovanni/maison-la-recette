<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Enums\SessionStatus;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\ExperienceResource;
use App\Http\Resources\ExperienceSessionResource;
use App\Models\Booking;
use App\Models\ExperienceSession;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * The reservation step: the details of one date and the choice of seats.
     */
    public function show(Request $request, ExperienceSession $session): Response
    {
        abort_unless($session->experience->is_published && $session->status === SessionStatus::Open && $session->starts_at->isFuture(), 404);

        return Inertia::render('bookings/show', [
            'experience' => ExperienceResource::make($session->experience)->resolve($request),
            'session' => ExperienceSessionResource::make($session)->resolve($request),
        ]);
    }

    /**
     * The payment step of a booking. Prototype: the card form is a demo,
     * nothing is charged and no card detail is kept.
     */
    public function create(Request $request, ExperienceSession $session): Response|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Companies do not pay online: they are sent to the quote request.
        if (! $user->canBookOnline()) {
            return to_route('contact', ['type' => 'devis_experience', 'experience_type' => $session->experience->type->value]);
        }

        $remaining = $session->remainingSeats();

        abort_unless($session->experience->is_published && $session->status === SessionStatus::Open && $session->starts_at->isFuture() && $remaining > 0, 404);

        return Inertia::render('bookings/checkout', [
            'experience' => ExperienceResource::make($session->experience)->resolve($request),
            'session' => ExperienceSessionResource::make($session)->resolve($request),
            'seats' => max(1, min($request->integer('seats', 1), $remaining)),
        ]);
    }

    /**
     * Book seats on a session once the demo payment form is filled: the
     * booking is recorded as paid straight away, under the contact details
     * given on the form.
     */
    public function store(StoreBookingRequest $request, ExperienceSession $session): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        abort_unless($user->canBookOnline(), 403, 'La réservation en ligne est réservée aux particuliers.');
        abort_unless($session->experience->is_published, 404);

        $seats = $request->integer('seats');
        $contact = [
            'name' => trim($request->string('first_name').' '.$request->string('last_name')),
            'email' => $request->string('email')->toString(),
            'phone' => $request->input('phone'),
        ];

        DB::transaction(function () use ($session, $user, $seats, $contact): void {
            // Locked so two bookings cannot take the same last seats.
            $session = ExperienceSession::query()->lockForUpdate()->findOrFail($session->id);

            if ($session->status !== SessionStatus::Open || $session->starts_at->isPast()) {
                throw ValidationException::withMessages(['seats' => 'Cette date n\'est plus ouverte à la réservation.']);
            }

            $remaining = $session->remainingSeats();

            if ($seats > $remaining) {
                throw ValidationException::withMessages([
                    'seats' => $remaining === 0
                        ? 'Cette date est complète.'
                        : "Il ne reste que {$remaining} place(s) sur cette date.",
                ]);
            }

            $user->bookings()->create([
                'experience_session_id' => $session->id,
                ...$contact,
                'seats' => $seats,
                'amount_cents' => $seats * $session->price_cents,
                'status' => BookingStatus::Paid,
                'paid_at' => now(),
            ]);
        });

        Inertia::flash('success', 'Paiement accepté : votre réservation est confirmée. À très vite !');

        return to_route('dashboard');
    }

    public function cancel(Request $request, Booking $booking): RedirectResponse
    {
        abort_unless($booking->user_id === $request->user()?->id, 404);

        if (! $booking->isCancellable()) {
            throw ValidationException::withMessages(['booking' => 'Cette réservation ne peut plus être annulée.']);
        }

        $booking->update(['status' => BookingStatus::Cancelled]);

        Inertia::flash('success', 'Votre réservation a été annulée.');

        return to_route('dashboard');
    }
}
