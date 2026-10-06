<?php

namespace App\Filament\Support;

use Filament\Forms\Components\TextInput;

class EuroInput
{
    /**
     * A euro amount field backed by an integer column in cents.
     */
    public static function make(string $name): TextInput
    {
        return TextInput::make($name)
            ->numeric()
            ->minValue(0)
            ->step(0.01)
            ->suffix('€')
            ->formatStateUsing(fn (int|string|null $state): ?float => filled($state) ? ((int) $state) / 100 : null)
            ->dehydrateStateUsing(fn (int|float|string|null $state): ?int => filled($state) ? (int) round(((float) $state) * 100) : null);
    }
}
