<?php

namespace App\Http\Resources;

use App\Models\Inquiry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * What a customer sees of their own request: never the internal notes.
 *
 * @mixin Inquiry
 */
class InquiryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => ['value' => $this->type->value, 'label' => $this->type->getLabel()],
            'status' => ['value' => $this->status->value, 'label' => $this->status->customerLabel()],
            'experience_type' => $this->experience_type?->getLabel(),
            'participants' => $this->participants,
            'desired_date' => $this->desired_date?->toDateString(),
            'venue' => $this->venue,
            'message' => $this->message,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
