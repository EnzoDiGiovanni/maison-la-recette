<?php

namespace Database\Seeders;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\ExperienceSession;
use App\Models\User;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    /**
     * Seats of the paid bookings of a session that has taken place: about
     * ten participants each time, as in the client's brief.
     */
    private const array PAST_SEATS = [2, 3, 1, 2, 2];

    /**
     * What an upcoming session already holds, the soonest being the fullest.
     *
     * @var list<list<array{int, BookingStatus}>>
     */
    private const array UPCOMING = [
        [[2, BookingStatus::Paid], [4, BookingStatus::Paid], [1, BookingStatus::Pending]],
        [[3, BookingStatus::Paid], [2, BookingStatus::Cancelled]],
        [[2, BookingStatus::Paid], [2, BookingStatus::Refunded]],
        [[1, BookingStatus::Paid]],
    ];

    /**
     * @var list<array{string, ?string}>
     */
    private const array CUSTOMERS = [
        ['Claire Fontaine', '06 12 34 56 78'], ['Hélène Marchand', null], ['Sophie Garnier', '06 98 76 54 32'],
        ['Julien Perrin', null], ['Nathalie Roche', '07 11 22 33 44'], ['Marc Delorme', null],
        ['Isabelle Vidal', '06 55 44 33 22'], ['Catherine Lemoine', '06 21 43 65 87'], ['Philippe Barbier', null],
        ['Véronique Masson', '06 74 85 96 10'], ['Anne-Laure Chevalier', null], ['Olivier Brunet', '07 68 12 45 90'],
        ['Sandrine Faure', null], ['Pascale Royer', '06 33 21 09 87'], ['Florence Giraud', null],
        ['Dominique Carpentier', '06 45 12 78 36'], ['Brigitte Meunier', null], ['Stéphane Colin', '07 82 64 19 05'],
        ['Christine Leroux', null], ['Valérie Picard', '06 17 29 38 46'], ['Patricia Renaud', null],
        ['François Guillot', '06 90 81 72 63'], ['Martine Besson', null], ['Laurence Hubert', '06 58 47 36 25'],
    ];

    public function run(): void
    {
        if (Booking::query()->exists()) {
            return;
        }

        $sessions = ExperienceSession::query()->orderBy('starts_at')->get();
        $plans = [];

        foreach ($sessions->filter(fn (ExperienceSession $session): bool => $session->starts_at->isPast()) as $session) {
            foreach (self::PAST_SEATS as $position => $seats) {
                // Booked one to three weeks before the session.
                $plans[] = [$session, $seats, BookingStatus::Paid, $session->starts_at->copy()->subDays(8 + $position * 3)];
            }
        }

        $upcoming = $sessions->filter(fn (ExperienceSession $session): bool => $session->starts_at->isFuture())->values();

        foreach (self::UPCOMING as $rank => $bookings) {
            foreach ($bookings as $position => [$seats, $status]) {
                if (isset($upcoming[$rank])) {
                    $plans[] = [$upcoming[$rank], $seats, $status, now()->subDays(1 + $rank * 2 + $position)];
                }
            }
        }

        // Claire's bookings belong to the demo individual account.
        $customer = User::query()->where('email', 'particulier@example.com')->first();

        foreach ($plans as $index => [$session, $seats, $status, $bookedAt]) {
            [$name, $phone] = self::CUSTOMERS[$index % count(self::CUSTOMERS)];

            $booking = new Booking([
                'user_id' => $name === $customer?->name ? $customer->id : null,
                'experience_session_id' => $session->id,
                'name' => $name,
                'email' => str($name)->slug('.').'@example.com',
                'phone' => $phone,
                'seats' => $seats,
                'amount_cents' => $seats * $session->price_cents,
                'stripe_checkout_id' => 'cs_test_demo_'.($index + 1),
                'status' => $status,
                'paid_at' => in_array($status, [BookingStatus::Paid, BookingStatus::Refunded], true) ? $bookedAt : null,
            ]);
            $booking->setCreatedAt($bookedAt);
            $booking->save();
        }
    }
}
