<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum BookingStatus: string implements HasColor, HasLabel
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Cancelled = 'cancelled';
    case Refunded = 'refunded';

    public function getLabel(): string
    {
        return match ($this) {
            self::Pending => 'En attente de paiement',
            self::Paid => 'Payée',
            self::Cancelled => 'Annulée',
            self::Refunded => 'Remboursée',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::Pending => 'warning',
            self::Paid => 'success',
            self::Cancelled => 'gray',
            self::Refunded => 'danger',
        };
    }
}
