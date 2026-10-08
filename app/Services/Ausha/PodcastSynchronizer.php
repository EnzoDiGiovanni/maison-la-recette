<?php

namespace App\Services\Ausha;

use App\Models\Podcast;
use App\Models\Speaker;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

/**
 * Copies the episodes published on Ausha into the podcasts table.
 */
class PodcastSynchronizer
{
    public function __construct(private readonly AushaFeed $feed) {}

    /**
     * @return array{created: int, updated: int}
     */
    public function sync(): array
    {
        $created = 0;
        $updated = 0;
        $speakers = Speaker::query()->pluck('name', 'id')
            ->map(fn (string $name): string => '-'.Str::slug($name).'-')
            ->reject(fn (string $name): bool => $name === '--')
            ->all();

        // Oldest first, so that ids follow the publication order.
        foreach (array_reverse($this->feed->episodes()) as $episode) {
            $podcast = $this->find($episode);

            if ($podcast === null) {
                $this->create($episode, $this->speaker($episode->title, $speakers));
                $created++;

                continue;
            }

            // What was written in the back office is never overwritten:
            // only the listening data follows the feed.
            $podcast->fill([
                'ausha_guid' => $episode->guid,
                'link' => $episode->link,
                'audio_url' => $episode->audioUrl,
                'duration' => $episode->duration,
                // A cover that could not be downloaded is tried again.
                'image' => $podcast->image ?? $this->image($episode),
            ]);

            if ($podcast->isDirty()) {
                $podcast->save();
                $updated++;
            }
        }

        return ['created' => $created, 'updated' => $updated];
    }

    private function find(AushaEpisode $episode): ?Podcast
    {
        return Podcast::query()->where('ausha_guid', $episode->guid)->first()
            // Episodes added by hand before the import are matched by their link.
            ?? Podcast::query()->whereNull('ausha_guid')->where('link', $episode->link)->first();
    }

    /**
     * Episode titles start with the name of the guest: a new episode gets the
     * intervenant whose name is found in its title, whatever the accents or
     * hyphens. The client then changes or removes it freely.
     *
     * @param  array<int, string>  $speakers
     */
    private function speaker(string $title, array $speakers): ?int
    {
        $title = '-'.Str::slug($title).'-';

        foreach ($speakers as $id => $name) {
            if (str_contains($title, $name)) {
                return $id;
            }
        }

        return null;
    }

    private function create(AushaEpisode $episode, ?int $speakerId): void
    {
        Podcast::create([
            'ausha_guid' => $episode->guid,
            'title' => $episode->title,
            'slug' => $this->slug($episode->title),
            'season' => $episode->season,
            'number' => $episode->number,
            'speaker_id' => $speakerId,
            'link' => $episode->link,
            'audio_url' => $episode->audioUrl,
            'duration' => $episode->duration,
            'image' => $this->image($episode),
            'summary' => $episode->summary,
            'published_at' => $episode->publishedAt,
        ]);
    }

    private function slug(string $title): string
    {
        $base = Str::limit(Str::slug($title), 200, '') ?: 'episode';
        $slug = $base;

        for ($suffix = 2; Podcast::query()->where('slug', $slug)->exists(); $suffix++) {
            $slug = "{$base}-{$suffix}";
        }

        return $slug;
    }

    /**
     * Stores the cover on the public disk, like an image uploaded from the
     * back office. An episode without its cover is still worth importing.
     */
    private function image(AushaEpisode $episode): ?string
    {
        if ($episode->imageUrl === null) {
            return null;
        }

        try {
            $response = Http::timeout(30)->get($episode->imageUrl);
        } catch (Throwable) {
            return null;
        }

        $extension = match (Str::before((string) $response->header('Content-Type'), ';')) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            default => null,
        };

        if ($response->failed() || $extension === null) {
            return null;
        }

        $path = "podcasts/ausha-{$episode->guid}.{$extension}";

        return Storage::disk('public')->put($path, $response->body()) ? $path : null;
    }
}
