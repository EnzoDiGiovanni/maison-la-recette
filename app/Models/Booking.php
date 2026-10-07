<?php

namespace App\Models;

use App\Enums\BookingStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $user_id
 * @property int $experience_session_id
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property int $seats
 * @property int $amount_cents
 * @property string|null $stripe_checkout_id
 * @property BookingStatus $status
 * @property Carbon|null $paid_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read ExperienceSession $session
 * @property-read User|null $user
 */
#[Fillable(['user_id', 'experience_session_id', 'name', 'email', 'phone', 'seats', 'amount_cents', 'stripe_checkout_id', 'status', 'paid_at'])]
class Booking extends Model
{
    /**
     * @return BelongsTo<ExperienceSession, $this>
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(ExperienceSession::class, 'experience_session_id');
    }

    /**
     * The customer account the booking was made from, if any.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * A customer can still cancel a live booking until the session starts.
     */
    public function isCancellable(): bool
    {
        return in_array($this->status, [BookingStatus::Pending, BookingStatus::Paid], true)
            && $this->session->starts_at->isFuture();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => BookingStatus::class,
            'paid_at' => 'datetime',
        ];
    }
}
