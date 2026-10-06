<?php

namespace Database\Seeders;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\ExperienceSession;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        if (Booking::query()->exists()) {
            return;
        }

        $bookings = [
            ['Claire Fontaine', 'claire.fontaine@example.com', '06 12 34 56 78', 2, BookingStatus::Paid],
            ['Hélène Marchand', 'helene.marchand@example.com', null, 1, BookingStatus::Paid],
            ['Sophie Garnier', 'sophie.garnier@example.com', '06 98 76 54 32', 4, BookingStatus::Paid],
            ['Julien Perrin', 'julien.perrin@example.com', null, 2, BookingStatus::Pending],
            ['Nathalie Roche', 'nathalie.roche@example.com', '07 11 22 33 44', 3, BookingStatus::Paid],
            ['Marc Delorme', 'marc.delorme@example.com', null, 2, BookingStatus::Cancelled],
            ['Isabelle Vidal', 'isabelle.vidal@example.com', '06 55 44 33 22', 2, BookingStatus::Refunded],
        ];

        $sessions = ExperienceSession::query()->orderBy('starts_at')->get();

        if ($sessions->isEmpty()) {
            return;
        }

        foreach ($bookings as $index => [$name, $email, $phone, $seats, $status]) {
            /** @var ExperienceSession $session */
            $session = $sessions[$index % $sessions->count()];
            $bookedAt = now()->subDays(20 - $index * 2);

            $booking = new Booking([
                'experience_session_id' => $session->id,
                'name' => $name,
                'email' => $email,
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
