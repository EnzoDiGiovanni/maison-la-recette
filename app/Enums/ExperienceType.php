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

    /**
     * Heading of the page listing every experience of this type.
     */
    public function pluralLabel(): string
    {
        return match ($this) {
            self::Atelier => 'Les ateliers',
            self::FoodTour => 'Les good tours',
            self::Immersion => 'Les immersions',
        };
    }

    /**
     * URL segment of that page: /experiences/ateliers.
     */
    public function slug(): string
    {
        return match ($this) {
            self::Atelier => 'ateliers',
            self::FoodTour => 'good-tours',
            self::Immersion => 'immersions',
        };
    }

    public static function fromSlug(string $slug): self
    {
        foreach (self::cases() as $type) {
            if ($type->slug() === $slug) {
                return $type;
            }
        }

        abort(404);
    }

    /**
     * @return list<string>
     */
    public static function slugs(): array
    {
        return array_map(fn (self $type): string => $type->slug(), self::cases());
    }
}
