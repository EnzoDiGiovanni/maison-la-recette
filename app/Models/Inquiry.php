<?php

namespace App\Models;

use App\Enums\ExperienceType;
use App\Enums\InquiryStatus;
use App\Enums\InquiryType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $user_id
 * @property InquiryType $type
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property string|null $company
 * @property ExperienceType|null $experience_type
 * @property int|null $participants
 * @property Carbon|null $desired_date
 * @property string|null $venue
 * @property string $message
 * @property InquiryStatus $status
 * @property string|null $internal_notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User|null $user
 */
#[Fillable(['user_id', 'type', 'name', 'email', 'phone', 'company', 'experience_type', 'participants', 'desired_date', 'venue', 'message', 'status', 'internal_notes'])]
class Inquiry extends Model
{
    /**
     * The customer account the request was sent from, if any.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => InquiryType::class,
            'experience_type' => ExperienceType::class,
            'desired_date' => 'date',
            'status' => InquiryStatus::class,
        ];
    }
}
