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
                Select::make('rating')
                    ->label('Note')
                    ->options([5 => '5 étoiles', 4 => '4 étoiles', 3 => '3 étoiles', 2 => '2 étoiles', 1 => '1 étoile'])
                    ->default(5)
                    ->required()
                    ->selectablePlaceholder(false),
                Select::make('experience_id')
                    ->label('Expérience concernée')
                    ->relationship('experience', 'title')
                    ->placeholder('Avis général')
                    ->helperText('L\'avis s\'affiche sur la page de cette expérience et de son format.'),
                Select::make('experience_type')
                    ->label('Format concerné')
                    ->helperText('À renseigner seulement si l\'avis ne porte pas sur une expérience précise.')
                    ->options(ExperienceType::class),
                Toggle::make('is_published')
                    ->label('Visible sur le site')
                    ->inline(false),
            ]);
    }
}
