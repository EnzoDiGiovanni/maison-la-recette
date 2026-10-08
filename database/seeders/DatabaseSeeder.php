<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (app()->isProduction()) {
            throw new RuntimeException('Les seeders créent des données de démonstration et un compte de test : ils ne doivent pas être lancés en production.');
        }

        if (! User::query()->where('email', 'test@example.com')->exists()) {
            User::factory()->admin()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        // Demo customer accounts, one of each type (password : « password »).
        foreach ([
            ['Claire Fontaine', 'particulier@example.com', 'individual', '06 12 34 56 78', null],
            ['Laure Bertin', 'entreprise@example.com', 'company', '04 72 00 00 01', 'Mutuelle des Deux Fleuves'],
        ] as [$name, $email, $state, $phone, $company]) {
            if (! User::query()->where('email', $email)->exists()) {
                User::factory()->{$state}()->create(['name' => $name, 'email' => $email, 'phone' => $phone, 'company' => $company]);
            }
        }

        $this->call([
            SettingSeeder::class,
            SpeakerSeeder::class,
            PodcastSeeder::class,
            ExperienceSeeder::class,
            ExperienceSessionSeeder::class,
            BookingSeeder::class,
            InquirySeeder::class,
            TestimonialSeeder::class,
            PostSeeder::class,
        ]);
    }
}
