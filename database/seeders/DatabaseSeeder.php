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
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        $this->call([
            SettingSeeder::class,
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
