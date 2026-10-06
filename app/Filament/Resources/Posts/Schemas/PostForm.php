<?php

namespace App\Filament\Resources\Posts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class PostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Article')
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
                        Textarea::make('excerpt')
                            ->label('Chapô')
                            ->rows(3)
                            ->columnSpanFull(),
                        RichEditor::make('body')
                            ->label('Texte')
                            ->required()
                            ->columnSpanFull(),
                        FileUpload::make('cover_image')
                            ->label('Image de couverture')
                            ->image()
                            ->disk('public')
                            ->directory('posts'),
                        DateTimePicker::make('published_at')
                            ->label('Date de publication')
                            ->seconds(false)
                            ->helperText('Laisser vide pour garder l\'article en brouillon.'),
                    ]),
                Section::make('Référencement')
                    ->collapsed()
                    ->schema([
                        TextInput::make('meta_title')
                            ->label('Titre pour Google')
                            ->maxLength(255),
                        Textarea::make('meta_description')
                            ->label('Description pour Google')
                            ->rows(2)
                            ->maxLength(255),
                    ]),
            ]);
    }
}
