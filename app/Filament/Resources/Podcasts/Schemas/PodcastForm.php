<?php

namespace App\Filament\Resources\Podcasts\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class PodcastForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Écoute')
                    ->schema([
                        TextInput::make('link')
                            ->label('Lien du podcast')
                            ->helperText('Lien de la page d\'écoute à coller ici.')
                            ->url()
                            ->required()
                            ->maxLength(2048),
                        Textarea::make('iframe')
                            ->label('Iframe')
                            ->helperText('Code d\'intégration du lecteur (<iframe …>), à copier depuis la plateforme d\'hébergement.')
                            ->rows(4),
                    ]),
                Section::make('Présentation')
                    ->columns(2)
                    ->schema([
                        TextInput::make('title')
                            ->label('Titre')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (Set $set, ?string $state, string $operation): void {
                                if ($operation === 'create') {
                                    $set('slug', Str::slug((string) $state));
                                }
                            }),
                        TextInput::make('slug')
                            ->label('Adresse (slug)')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        TextInput::make('season')
                            ->label('Saison')
                            ->numeric()
                            ->minValue(1),
                        TextInput::make('number')
                            ->label('Numéro')
                            ->numeric()
                            ->minValue(1),
                        DatePicker::make('published_at')
                            ->label('Date de publication'),
                        Toggle::make('is_featured')
                            ->label('Mettre à la une')
                            ->inline(false),
                        Textarea::make('summary')
                            ->label('Résumé')
                            ->rows(8)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
