<?php

namespace App\Filament\Resources\Inquiries\Schemas;

use App\Enums\ExperienceType;
use App\Enums\InquiryStatus;
use App\Enums\InquiryType;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class InquiryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Suivi')
                    ->schema([
                        Select::make('status')
                            ->label('Statut')
                            ->options(InquiryStatus::class)
                            ->required(),
                        Textarea::make('internal_notes')
                            ->label('Notes internes')
                            ->helperText('Visibles uniquement ici.')
                            ->rows(6),
                    ]),
                Section::make('Demande reçue')
                    ->columns(2)
                    ->schema([
                        Select::make('type')
                            ->label('Type')
                            ->options(InquiryType::class)
                            ->disabled(),
                        TextInput::make('company')
                            ->label('Structure')
                            ->disabled(),
                        TextInput::make('name')
                            ->label('Nom')
                            ->disabled(),
                        TextInput::make('email')
                            ->label('E-mail')
                            ->disabled(),
                        TextInput::make('phone')
                            ->label('Téléphone')
                            ->disabled(),
                        Select::make('experience_type')
                            ->label('Format souhaité')
                            ->options(ExperienceType::class)
                            ->disabled(),
                        TextInput::make('participants')
                            ->label('Participants')
                            ->disabled(),
                        DatePicker::make('desired_date')
                            ->label('Date souhaitée')
                            ->disabled(),
                        TextInput::make('venue')
                            ->label('Lieu souhaité')
                            ->disabled()
                            ->columnSpanFull(),
                        Textarea::make('message')
                            ->label('Message')
                            ->rows(8)
                            ->disabled()
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
