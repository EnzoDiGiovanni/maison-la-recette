<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum ExperienceType: string implements HasLabel
{
    case Atelier = 'atelier';
    case FoodTour = 'food_tour';
    case Immersion = 'immersion';

    public function getLabel(): string
    {
        return match ($this) {
            self::Atelier => 'Atelier',
            self::FoodTour => 'Food tour',
            self::Immersion => 'Immersion',
        };
    }
}
