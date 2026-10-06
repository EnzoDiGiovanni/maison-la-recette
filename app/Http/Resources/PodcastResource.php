<?php

namespace App\Http\Resources;

use App\Models\Podcast;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'summary' => $this->summary,
            'published_at' => $this->published_at?->toDateString(),
            'is_featured' => $this->is_featured,
        ];
    }
}
