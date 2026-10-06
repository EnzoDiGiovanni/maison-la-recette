<?php

namespace App\Http\Resources;

use App\Models\ExperienceSession;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ExperienceSession
 */
class ExperienceSessionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'starts_at' => $this->starts_at->toIso8601String(),
            'location' => $this->location,
            'capacity' => $this->capacity,
            'remaining_seats' => $this->remainingSeats(),
            'price' => $this->price_cents / 100,
        ];
    }
}
