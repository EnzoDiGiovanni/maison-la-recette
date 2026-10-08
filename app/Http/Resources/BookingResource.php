<?php

namespace App\Http\Resources;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Booking
 */
class BookingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => ['value' => $this->status->value, 'label' => $this->status->getLabel()],
            'seats' => $this->seats,
            'amount' => $this->amount_cents / 100,
            'paid_at' => $this->paid_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'is_upcoming' => $this->session->starts_at->isFuture(),
            'can_cancel' => $this->isCancellable(),
            'session' => [
                'id' => $this->session->id,
                'starts_at' => $this->session->starts_at->toIso8601String(),
                'location' => $this->session->location ?? $this->session->experience->location,
            ],
            'experience' => [
                'title' => $this->session->experience->title,
                'slug' => $this->session->experience->slug,
                'type' => $this->session->experience->type->getLabel(),
                'type_slug' => $this->session->experience->type->slug(),
                'is_published' => $this->session->experience->is_published,
            ],
        ];
    }
}
