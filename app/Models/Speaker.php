<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string|null $role
 * @property string|null $bio
 * @property string|null $photo
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Podcast> $podcasts
 */
#[Fillable(['name', 'role', 'bio', 'photo'])]
class Speaker extends Model
{
    /**
     * @return HasMany<Podcast, $this>
     */
    public function podcasts(): HasMany
    {
        return $this->hasMany(Podcast::class);
    }
}
