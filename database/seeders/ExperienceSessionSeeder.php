<?php

namespace Database\Seeders;

use App\Enums\ExperienceType;
use App\Enums\SessionStatus;
use App\Models\Experience;
use App\Models\ExperienceSession;
use Illuminate\Database\Seeder;

class ExperienceSessionSeeder extends Seeder
{
    /**
     * Past and upcoming dates for each experience open to individuals: about
     * five experiences have already taken place, as in the client's brief.
     * Immersions are quote-only, so they get no session.
     */
    public function run(): void
    {
        if (ExperienceSession::query()->exists()) {
            return;
        }

        $experiences = Experience::query()
            ->where('type', '!=', ExperienceType::Immersion)
            ->orderBy('sort_order')
            ->get();

        foreach ($experiences as $index => $experience) {
            $isAtelier = $experience->type === ExperienceType::Atelier;
            $hour = $isAtelier ? 18 : 10;
            $location = $isAtelier ? 'Chez notre partenaire, Lyon 1' : $experience->location;

            // The first experience has run twice already.
            $past = $index === 0 ? [-7, -3] : [-3 - $index];

            foreach ([...$past, 2 + $index, 6 + $index, 10 + $index] as $weeks) {
                ExperienceSession::query()->create([
                    'experience_id' => $experience->id,
                    'starts_at' => now()->addWeeks($weeks)->startOfWeek()->addDays($isAtelier ? 3 : 5)->setTime($hour, $isAtelier ? 30 : 0),
                    'location' => $location,
                    'capacity' => $isAtelier ? 10 : 12,
                    'price_cents' => $experience->price_from_cents ?? 0,
                    'status' => SessionStatus::Open,
                ]);
            }
        }
    }
}
