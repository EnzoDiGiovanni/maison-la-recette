<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum InquiryType: string implements HasLabel
{
    case Contact = 'contact';
    case ExperienceQuote = 'devis_experience';
    case PodcastQuote = 'devis_podcast';

    public function getLabel(): string
    {
        return match ($this) {
            self::Contact => 'Contact',
            self::ExperienceQuote => 'Devis expérience',
            self::PodcastQuote => 'Devis podcast',
        };
    }
}
