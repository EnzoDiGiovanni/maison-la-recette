<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum InquiryStatus: string implements HasColor, HasLabel
{
    case New = 'new';
    case Contacted = 'contacted';
    case Quoted = 'quoted';
    case Won = 'won';
    case Lost = 'lost';
    case Closed = 'closed';

    public function getLabel(): string
    {
        return match ($this) {
            self::New => 'Nouvelle',
            self::Contacted => 'Rappelée',
            self::Quoted => 'Devis envoyé',
            self::Won => 'Gagnée',
            self::Lost => 'Perdue',
            self::Closed => 'Classée',
        };
    }

    /**
     * What the customer reads in their account: no won/lost wording.
     */
    public function customerLabel(): string
    {
        return match ($this) {
            self::New => 'Reçue',
            self::Contacted => 'En cours d\'échange',
            self::Quoted => 'Devis envoyé',
            self::Won => 'Confirmée',
            self::Lost, self::Closed => 'Clôturée',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::New => 'danger',
            self::Contacted => 'warning',
            self::Quoted => 'info',
            self::Won => 'success',
            self::Lost => 'gray',
            self::Closed => 'gray',
        };
    }
}
