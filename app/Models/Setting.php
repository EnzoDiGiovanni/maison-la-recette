<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $key
 * @property string|null $value
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['key', 'value'])]
class Setting extends Model
{
    public $incrementing = false;

    protected $primaryKey = 'key';

    protected $keyType = 'string';

    /**
     * All settings as a key => value map.
     *
     * @return array<string, string|null>
     */
    public static function values(): array
    {
        /** @var array<string, string|null> */
        return static::query()->pluck('value', 'key')->all();
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        return static::query()->find($key)->value ?? $default;
    }

    public static function set(string $key, ?string $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
