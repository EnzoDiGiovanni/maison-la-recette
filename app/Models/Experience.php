<?php

namespace App\Models;

use App\Enums\ExperienceType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property ExperienceType $type
 * @property string $title
 * @property string $slug
 * @property string|null $tagline
 * @property string|null $description
 * @property list<string>|null $highlights
 * @property string|null $duration_label
 * @property int|null $price_from_cents
 * @property string|null $location
 * @property string|null $cover_image
 * @property list<string>|null $photos
 * @property bool $is_published
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, ExperienceSession> $sessions
 */
#[Fillable(['type', 'title', 'slug', 'tagline', 'description', 'highlights', 'duration_label', 'price_from_cents', 'location', 'cover_image', 'photos', 'is_published', 'sort_order'])]
class Experience extends Model
{
    /**
     * @return HasMany<ExperienceSession, $this>
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(ExperienceSession::class);
    }

    /**
     * @return HasManyThrough<Booking, ExperienceSession, $this>
     */
    public function bookings(): HasManyThrough
    {
        return $this->hasManyThrough(Booking::class, ExperienceSession::class);
    }

    public function hasBookings(): bool
    {
        return $this->bookings()->exists();
    }

    /**
     * Records the client has made visible on the site, in her chosen order.
     *
     * @param  Builder<$this>  $query
     */
    #[Scope]
    protected function published(Builder $query): void
    {
        $query->where('is_published', true)->orderBy('sort_order');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => ExperienceType::class,
            'highlights' => 'array',
            'photos' => 'array',
            'is_published' => 'boolean',
        ];
    }
}
