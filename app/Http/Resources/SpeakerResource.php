<?php

namespace App\Http\Resources;

use App\Models\Speaker;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin Speaker
 */
class SpeakerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role,
            'bio' => $this->bio,
            'photo_url' => $this->photo === null ? null : Storage::disk('public')->url($this->photo),
        ];
    }
}
