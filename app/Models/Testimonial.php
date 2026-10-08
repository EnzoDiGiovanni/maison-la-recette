<?php

namespace App\Models;

use App\Enums\ExperienceType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $author_name
 * @property string|null $author_role
 * @property string $quote
 * @property int $rating
 * @property int|null $experience_id
 * @property ExperienceType|null $experience_type
 * @property bool $is_published
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Experience|null $experience
 */
#[Fillable(['author_name', 'author_role', 'quote', 'rating', 'experience_id', 'experience_type', 'is_published', 'sort_order'])]
class Testimonial extends Model
{
    /**
     * Records the client has made visible on the site, in her chosen order.
     * A review about an experience follows it: hidden while it is unpublished.
     *
     * @param  Builder<$this>  $query
     */
    #[Scope]
    protected function published(Builder $query): void
    {
        $query
            ->where('is_published', true)
            ->where(fn (Builder $query) => $query->whereNull('experience_id')->orWhereRelation('experience', 'is_published', true))
            ->orderBy('sort_order');
    }

    /**
     * @return BelongsTo<Experience, $this>
     */
    public function experience(): BelongsTo
    {
        return $this->belongsTo(Experience::class);
    }

    /**
     * Reviews about any experience of a format, plus the general ones.
     *
     * @param  Builder<$this>  $query
     */
    #[Scope]
    protected function forType(Builder $query, ExperienceType $type): void
    {
        $query->where(fn (Builder $query) => $query
            ->whereRelation('experience', 'type', $type)
            ->orWhere(fn (Builder $query) => $query->whereNull('experience_id')->matchingType($type)));
    }

    /**
     * @param  Builder<$this>  $query
     */
    #[Scope]
    protected function matchingType(Builder $query, ExperienceType $type): void
    {
        $query->where(fn (Builder $query) => $query->whereNull('experience_type')->orWhere('experience_type', $type));
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'experience_type' => ExperienceType::class,
            'is_published' => 'boolean',
        ];
    }
}
