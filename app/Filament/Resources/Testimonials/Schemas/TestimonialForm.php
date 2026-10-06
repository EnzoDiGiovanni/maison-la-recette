<?php

namespace App\Filament\Resources\Testimonials\Schemas;

use App\Enums\ExperienceType;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class TestimonialForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('author_name')
                    ->label('Prénom')
                    ->required()
                    ->maxLength(255),
                TextInput::make('author_role')
                    ->label('Fonction')
                    ->placeholder('Responsable RSE')
                    ->maxLength(255),
                Textarea::make('quote')
                    ->label('Avis')
                    ->required()
                    ->rows(5)
                    ->columnSpanFull(),
                Select::make('experience_type')
                    ->label('Format concerné')
                    ->options(ExperienceType::class),
                Toggle::make('is_published')
                    ->label('Visible sur le site')
                    ->inline(false),
            ]);
    }
}
