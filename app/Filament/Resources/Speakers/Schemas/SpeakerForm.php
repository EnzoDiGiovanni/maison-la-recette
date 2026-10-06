<?php

namespace App\Filament\Resources\Speakers\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Schema;

class SpeakerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components(self::components());
    }

    /**
     * Also used to create an intervenant on the fly from the podcast form.
     *
     * @return array<int, Component>
     */
    public static function components(): array
    {
        return [
            TextInput::make('name')
                ->label('Nom')
                ->required()
                ->maxLength(255),
            TextInput::make('role')
                ->label('Fonction ou structure')
                ->placeholder('Cheffe étoilée')
                ->maxLength(255),
            Textarea::make('bio')
                ->label('Présentation')
                ->rows(5)
                ->columnSpanFull(),
            FileUpload::make('photo')
                ->label('Photo')
                ->image()
                ->disk('public')
                ->directory('speakers'),
        ];
    }
}
