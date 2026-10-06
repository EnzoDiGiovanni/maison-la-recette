<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property int|null $season
 * @property int|null $number
 * @property int|null $speaker_id
 * @property string $link
 * @property string|null $iframe
 * @property string|null $image
 * @property string|null $summary
 * @property string|null $quote
 * @property Carbon|null $published_at
 * @property bool $is_featured
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Speaker|null $speaker
 */
#[Fillable(['title', 'slug', 'season', 'number', 'speaker_id', 'link', 'iframe', 'image', 'summary', 'quote', 'published_at', 'is_featured'])]
class Podcast extends Model
{
    /**
     * @return BelongsTo<Speaker, $this>
     */
    public function speaker(): BelongsTo
    {
        return $this->belongsTo(Speaker::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'is_featured' => 'boolean',
        ];
    }
}
