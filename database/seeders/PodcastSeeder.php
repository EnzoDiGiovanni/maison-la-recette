<?php

namespace Database\Seeders;

use App\Models\Podcast;
use App\Models\Speaker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PodcastSeeder extends Seeder
{
    /**
     * The guests are real people: no words are put in their mouths.
     */
    private const string PLACEHOLDER_QUOTE = 'Citation d\'exemple, à remplacer par une phrase marquante de l\'épisode.';

    /**
     * Demo episodes built from the guests shown in the client's presentation.
     * Seasons, numbers and dates are placeholders; the iframe is left empty
     * until the real embed codes are pasted in the back office. Each one is
     * linked to its intervenant from SpeakerSeeder.
     */
    public function run(): void
    {
        $podcasts = [
            ['Jean-Marie Pedron', 'Les Jardins de la Mer', 1, 4, 'Direction le bord de mer, là où se cultivent les légumes de l\'océan.'],
            ['Camille Labro', 'L\'école comestible', 1, 9, 'Et si l\'éducation au goût commençait sur les bancs de l\'école ?'],
            ['Nadia Sammut', 'Cheffe étoilée', 2, 3, 'Dans la cuisine d\'une cheffe étoilée qui met ses convictions au menu.'],
            ['Rodolphe Landemaine', 'La boulangerie végétale', 2, 8, 'Peut-on faire lever une boulangerie sans beurre ni œufs ?'],
            ['Emilie Félix', 'L\'énergie, ça se cuisine !', 3, 2, 'Cuisiner autrement pour consommer moins d\'énergie, sans perdre en gourmandise.'],
            ['Charles Guirriec', 'La pêche durable', 3, 5, 'Sur les quais, à la rencontre de celles et ceux qui pêchent autrement.'],
        ];

        foreach ($podcasts as $index => [$guest, $theme, $season, $number, $hook]) {
            $title = "{$guest} — {$theme}";

            $podcast = Podcast::query()->firstOrCreate(
                ['slug' => Str::slug("{$guest} {$theme}")],
                [
                    'title' => $title,
                    'season' => $season,
                    'number' => $number,
                    'link' => 'https://smartlink.ausha.co/la-recette',
                    'summary' => "{$hook}\n\nL'épisode s'ouvre sur un reportage immersif, puis laisse place à une conversation avec {$guest} pour explorer les coulisses de nos assiettes et repartir avec des pistes concrètes.",
                    'published_at' => now()->startOfDay()->subMonths(count($podcasts) - $index),
                    'is_featured' => $index >= count($podcasts) - 2,
                ],
            );

            // Also fills demo podcasts seeded before intervenants existed.
            if ($podcast->speaker_id === null && $podcast->quote === null) {
                $podcast->update([
                    'speaker_id' => Speaker::query()->where('name', $guest)->value('id'),
                    'quote' => self::PLACEHOLDER_QUOTE,
                ]);
            }
        }
    }
}
