<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum SessionStatus: string implements HasColor, HasLabel
{
    case Open = 'open';
    case Full = 'full';
    case Cancelled = 'cancelled';

    public function getLabel(): string
    {
        return match ($this) {
            self::Open => 'Ouverte',
            self::Full => 'Complète',
            self::Cancelled => 'Annulée',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::Open => 'success',
            self::Full => 'warning',
            self::Cancelled => 'danger',
        };
    }
}
