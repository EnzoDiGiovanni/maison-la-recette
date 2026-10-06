<?php

namespace App\Filament\Resources\Experiences\Schemas;

use App\Enums\ExperienceType;
use App\Filament\Support\EuroInput;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ExperienceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Présentation')
                    ->columns(2)
                    ->schema([
                        Select::make('type')
                            ->label('Format')
                            ->options(ExperienceType::class)
                            ->required(),
                        Toggle::make('is_published')
                            ->label('Visible sur le site')
                            ->inline(false),
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
                        TextInput::make('tagline')
                            ->label('Accroche')
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Textarea::make('description')
                            ->label('Description')
                            ->rows(6)
                            ->columnSpanFull(),
                        Repeater::make('highlights')
                            ->label('Points forts')
                            ->simple(
                                TextInput::make('highlight')
                                    ->required()
                                    ->maxLength(255),
                            )
                            ->addActionLabel('Ajouter un point fort')
                            ->defaultItems(0)
                            ->columnSpanFull(),
                    ]),
                Section::make('Infos pratiques')
                    ->columns(3)
                    ->schema([
                        TextInput::make('duration_label')
                            ->label('Durée')
                            ->placeholder('2 h')
                            ->maxLength(255),
                        EuroInput::make('price_from_cents')
                            ->label('Prix « à partir de »')
                            ->helperText('Par personne. Laisser vide si sur devis uniquement.'),
                        TextInput::make('location')
                            ->label('Lieu')
                            ->placeholder('La Croix-Rousse, Lyon 4')
                            ->maxLength(255),
                    ]),
                Section::make('Photos')
                    ->schema([
                        FileUpload::make('cover_image')
                            ->label('Photo de couverture')
                            ->image()
                            ->disk('public')
                            ->directory('experiences'),
                        FileUpload::make('photos')
                            ->label('Galerie')
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->disk('public')
                            ->directory('experiences'),
                    ]),
            ]);
    }
}
