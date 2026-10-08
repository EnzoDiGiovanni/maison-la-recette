<?php

namespace App\Filament\Resources\Bookings\Schemas;

use App\Enums\BookingStatus;
use App\Filament\Support\EuroInput;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class BookingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Nom')
                    ->disabled(),
                TextInput::make('email')
                    ->label('E-mail')
                    ->disabled(),
                TextInput::make('phone')
                    ->label('Téléphone')
                    ->disabled(),
                TextInput::make('seats')
                    ->label('Places')
                    ->disabled(),
                EuroInput::make('amount_cents')
                    ->label('Montant')
                    ->disabled(),
                DateTimePicker::make('paid_at')
                    ->label('Payée le')
                    ->disabled(),
                Select::make('status')
                    ->label('Statut')
                    ->options(BookingStatus::class)
                    ->required(),
            ]);
    }
}
