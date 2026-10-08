<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\AccountType;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property UserRole $role
 * @property AccountType $account_type
 * @property string|null $phone
 * @property string|null $company
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Booking> $bookings
 * @property-read Collection<int, Inquiry> $inquiries
 * @property-read Collection<int, Podcast> $favoritePodcasts
 */
#[Fillable(['name', 'email', 'phone', 'company', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Same defaults as the columns, so a new account is a plain user before
     * being reloaded. Neither is fillable: only code can make an admin.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'role' => UserRole::User->value,
        'account_type' => AccountType::Individual->value,
    ];

    /**
     * Only admins reach the back office, never the accounts signed up on the site.
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->isAdmin();
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }

    /**
     * Only individuals book and pay online: companies go through a quote.
     */
    public function canBookOnline(): bool
    {
        return $this->account_type === AccountType::Individual;
    }

    /**
     * @return HasMany<Booking, $this>
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * @return HasMany<Inquiry, $this>
     */
    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    /**
     * Episodes saved to listen to later, the latest saved first.
     *
     * @return BelongsToMany<Podcast, $this>
     */
    public function favoritePodcasts(): BelongsToMany
    {
        return $this->belongsToMany(Podcast::class)->withTimestamps()->orderByPivot('created_at', 'desc');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'role' => UserRole::class,
            'account_type' => AccountType::class,
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
