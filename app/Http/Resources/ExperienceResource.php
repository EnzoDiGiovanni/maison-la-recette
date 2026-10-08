<?php

namespace App\Http\Resources;

use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin Experience
 */
class ExperienceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => [
                'value' => $this->type->value,
                'label' => $this->type->getLabel(),
                'slug' => $this->type->slug(),
                'plural_label' => $this->type->pluralLabel(),
            ],
            'title' => $this->title,
            'slug' => $this->slug,
            'tagline' => $this->tagline,
            'description' => $this->description,
            'highlights' => $this->highlights ?? [],
            'duration_label' => $this->duration_label,
            'price_from' => $this->price_from_cents === null ? null : $this->price_from_cents / 100,
            'location' => $this->location,
            'cover_image_url' => $this->cover_image === null ? null : Storage::disk('public')->url($this->cover_image),
            'photo_urls' => array_map(fn (string $path): string => Storage::disk('public')->url($path), $this->photos ?? []),
        ];
    }
}
