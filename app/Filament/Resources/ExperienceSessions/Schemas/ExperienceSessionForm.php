<?php

namespace App\Filament\Resources\ExperienceSessions\Schemas;

use App\Enums\SessionStatus;
use App\Filament\Support\EuroInput;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ExperienceSessionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('experience_id')
                    ->label('Expérience')
                    ->relationship('experience', 'title')
                    ->searchable()
                    ->preload()
                    ->required(),
                DateTimePicker::make('starts_at')
                    ->label('Date et heure')
                    ->seconds(false)
                    ->required(),
                TextInput::make('location')
                    ->label('Lieu de rendez-vous')
                    ->maxLength(255),
                TextInput::make('capacity')
                    ->label('Nombre de places')
                    ->numeric()
                    ->minValue(1)
                    ->required(),
                EuroInput::make('price_cents')
                    ->label('Prix par personne')
                    ->required(),
                Select::make('status')
                    ->label('Statut')
                    ->options(SessionStatus::class)
                    ->default(SessionStatus::Open)
                    ->required(),
            ]);
    }
}
