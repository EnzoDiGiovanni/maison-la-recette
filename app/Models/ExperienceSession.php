<?php

namespace App\Models;

use App\Enums\BookingStatus;
use App\Enums\SessionStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $experience_id
 * @property Carbon $starts_at
 * @property string|null $location
 * @property int $capacity
 * @property int $price_cents
 * @property SessionStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Experience $experience
 * @property-read Collection<int, Booking> $bookings
 */
#[Fillable(['experience_id', 'starts_at', 'location', 'capacity', 'price_cents', 'status'])]
class ExperienceSession extends Model
{
    /**
     * @return BelongsTo<Experience, $this>
     */
    public function experience(): BelongsTo
    {
        return $this->belongsTo(Experience::class);
    }

    /**
     * @return HasMany<Booking, $this>
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function hasBookings(): bool
    {
        return $this->bookings()->exists();
    }

    /**
     * Seats still available, counting paid bookings only.
     */
    public function remainingSeats(): int
    {
        $taken = (int) $this->bookings()->where('status', BookingStatus::Paid)->sum('seats');

        return max(0, $this->capacity - $taken);
    }

    /**
     * Open sessions that have not started yet, soonest first.
     *
     * @param  Builder<$this>  $query
     */
    #[Scope]
    protected function upcoming(Builder $query): void
    {
        $query->where('status', SessionStatus::Open)->where('starts_at', '>', now())->orderBy('starts_at');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'status' => SessionStatus::class,
        ];
    }
}
