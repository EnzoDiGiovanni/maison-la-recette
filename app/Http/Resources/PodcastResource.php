<?php

namespace App\Http\Resources;

use App\Models\Podcast;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin Podcast
 */
class PodcastResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'season' => $this->season,
            'number' => $this->number,
            'link' => $this->link,
            'iframe' => $this->iframe,
            'image_url' => $this->image === null ? null : Storage::disk('public')->url($this->image),
            'summary' => $this->summary,
            'quote' => $this->quote,
            'speaker' => $this->speaker === null ? null : SpeakerResource::make($this->speaker)->resolve($request),
            'published_at' => $this->published_at?->toDateString(),
            'is_featured' => $this->is_featured,
            'is_favorite' => in_array($this->id, $this->favoriteIds($request), true),
        ];
    }

    /**
     * Ids of the episodes saved by the signed-in account, read once per request.
     *
     * @return list<int>
     */
    private function favoriteIds(Request $request): array
    {
        if (! $request->attributes->has('favorite_podcast_ids')) {
            $request->attributes->set(
                'favorite_podcast_ids',
                $request->user()?->favoritePodcasts()->pluck('podcasts.id')->map(fn (mixed $id): int => (int) $id)->all() ?? [],
            );
        }

        /** @var list<int> */
        return $request->attributes->get('favorite_podcast_ids');
    }
}
