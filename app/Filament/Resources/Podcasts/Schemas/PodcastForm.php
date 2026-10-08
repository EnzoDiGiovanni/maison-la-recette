<?php

namespace App\Filament\Resources\Podcasts\Schemas;

use App\Filament\Resources\Speakers\Schemas\SpeakerForm;
use App\Models\Podcast;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class PodcastForm
{
    public const string IMPORTED_MESSAGE = 'Un épisode importé d\'Ausha reviendrait à la prochaine synchronisation : décochez plutôt « Visible sur le site ».';

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
                            ->maxLength(2048)
                            ->disabled(self::imported(...)),
                        TextInput::make('audio_url')
                            ->label('Fichier audio')
                            ->helperText('Adresse du fichier mp3 que le lecteur du site diffuse. Pour un épisode importé d\'Ausha, elle suit Ausha, comme le lien.')
                            ->url()
                            ->maxLength(2048)
                            ->disabled(self::imported(...)),
                        Textarea::make('iframe')
                            ->label('Iframe')
                            ->helperText('Utilisé seulement sans fichier audio : code d\'intégration du lecteur (<iframe …>), à copier depuis la plateforme d\'hébergement.')
                            ->rows(4),
                        FileUpload::make('image')
                            ->label('Image')
                            ->image()
                            ->disk('public')
                            ->directory('podcasts'),
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
                        Select::make('speaker_id')
                            ->label('Intervenant')
                            ->relationship('speaker', 'name')
                            ->searchable()
                            ->preload()
                            ->createOptionForm(SpeakerForm::components())
                            ->columnSpanFull(),
                        DatePicker::make('published_at')
                            ->label('Date de publication'),
                        Toggle::make('is_featured')
                            ->label('Mettre à la une')
                            ->inline(false),
                        Toggle::make('is_published')
                            ->label('Visible sur le site')
                            ->helperText('Décochez pour retirer l\'épisode du site sans le supprimer.')
                            ->default(true)
                            ->inline(false)
                            ->columnSpanFull(),
                        Textarea::make('summary')
                            ->label('Résumé')
                            ->rows(8)
                            ->columnSpanFull(),
                        Textarea::make('quote')
                            ->label('Citation')
                            ->helperText('Une phrase marquante de l\'intervenant, sans les guillemets.')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    /**
     * The listening data of an imported episode follows Ausha on each import.
     */
    private static function imported(?Podcast $record): bool
    {
        return $record?->isImported() ?? false;
    }
}
