<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum AccountType: string implements HasLabel
{
    case Individual = 'particulier';
    case Company = 'entreprise';

    public function getLabel(): string
    {
        return match ($this) {
            self::Individual => 'Particulier',
            self::Company => 'Entreprise',
        };
    }
}
