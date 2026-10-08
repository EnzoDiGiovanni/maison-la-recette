<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $ausha_guid
 * @property string $title
 * @property string $slug
 * @property int|null $season
 * @property int|null $number
 * @property int|null $speaker_id
 * @property string $link
 * @property string|null $audio_url
 * @property int|null $duration
 * @property string|null $iframe
 * @property string|null $image
 * @property string|null $summary
 * @property string|null $quote
 * @property Carbon|null $published_at
 * @property bool $is_featured
 * @property bool $is_published
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Speaker|null $speaker
 */
#[Fillable(['ausha_guid', 'title', 'slug', 'season', 'number', 'speaker_id', 'link', 'audio_url', 'duration', 'iframe', 'image', 'summary', 'quote', 'published_at', 'is_featured', 'is_published'])]
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
     * Episodes shown on the site. Imported episodes cannot be deleted, the
     * next import would bring them back: the client hides them instead.
     *
     * @param  Builder<$this>  $query
     */
    #[Scope]
    protected function published(Builder $query): void
    {
        $query->where('is_published', true);
    }

    public function isImported(): bool
    {
        return $this->ausha_guid !== null;
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
            'is_published' => 'boolean',
        ];
    }
}
