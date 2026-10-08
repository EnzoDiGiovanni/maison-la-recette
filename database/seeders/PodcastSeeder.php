<?php

namespace Database\Seeders;

use App\Models\Podcast;
use App\Models\Speaker;
use App\Services\Ausha\PodcastSynchronizer;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class PodcastSeeder extends Seeder
{
    /** Episodes shown under « Podcasts à la une » on a fresh database. */
    private const int FEATURED = 5;

    /** Share of the cover kept around its centre for a portrait, and its size in pixels. */
    private const float PORTRAIT_CROP = 0.62;

    private const int PORTRAIT_SIZE = 480;

    /**
     * The real episodes, imported from the Ausha feed: no demo episode is
     * invented. Each one is linked to its intervenant from SpeakerSeeder.
     */
    public function run(PodcastSynchronizer $synchronizer): void
    {
        try {
            $synchronizer->sync();
        } catch (Throwable $exception) {
            $this->command->warn("Épisodes non importés ({$exception->getMessage()}) : relancez « php artisan podcasts:sync ».");

            return;
        }

        $this->feature();
        $this->portraits();
    }

    /**
     * « À la une » is set by hand in the back office: only a database that
     * has none yet gets the latest full episodes.
     */
    private function feature(): void
    {
        if (Podcast::query()->where('is_featured', true)->exists()) {
            return;
        }

        $this->fullEpisodes()
            ->latest('published_at')
            ->limit(self::FEATURED)
            ->get()
            ->each
            ->update(['is_featured' => true]);
    }

    /**
     * The cover of an episode shows its guest: an intervenant without a
     * photo gets the centre of the cover of their episode, rather than the
     * face of someone else.
     */
    private function portraits(): void
    {
        $disk = Storage::disk('public');

        foreach (Speaker::query()->whereNull('photo')->get() as $speaker) {
            $cover = $this->fullEpisodes()
                ->where('speaker_id', $speaker->id)
                ->whereNotNull('image')
                ->oldest('published_at')
                ->value('image');

            if (! is_string($cover) || ! $disk->exists($cover)) {
                continue;
            }

            $path = 'speakers/'.Str::slug($speaker->name).'.jpg';

            if ($disk->put($path, $this->portrait((string) $disk->get($cover)))) {
                $speaker->update(['photo' => $path]);
            }
        }
    }

    /**
     * A square cut around the centre of the cover, where the face is; the
     * cover is kept whole when it cannot be read as an image.
     */
    private function portrait(string $cover): string
    {
        $image = function_exists('imagecreatefromstring') ? @imagecreatefromstring($cover) : false;

        if ($image === false) {
            return $cover;
        }

        $side = (int) round(min(imagesx($image), imagesy($image)) * self::PORTRAIT_CROP);
        $portrait = imagecreatetruecolor(self::PORTRAIT_SIZE, self::PORTRAIT_SIZE);

        imagecopyresampled(
            $portrait,
            $image,
            0,
            0,
            intdiv(imagesx($image) - $side, 2),
            intdiv(imagesy($image) - $side, 2),
            self::PORTRAIT_SIZE,
            self::PORTRAIT_SIZE,
            $side,
            $side,
        );

        ob_start();
        imagejpeg($portrait, null, 85);

        return (string) ob_get_clean();
    }

    /**
     * @return Builder<Podcast>
     */
    private function fullEpisodes(): Builder
    {
        return Podcast::query()->where('title', 'not like', '%extrait%');
    }
}
