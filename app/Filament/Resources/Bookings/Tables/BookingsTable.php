<?php

namespace App\Filament\Resources\Bookings\Tables;

use App\Enums\BookingStatus;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class BookingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('created_at')
                    ->label('Reçue le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
                TextColumn::make('session.experience.title')
                    ->label('Expérience'),
                TextColumn::make('session.starts_at')
                    ->label('Session')
                    ->dateTime('d/m/Y H:i'),
                TextColumn::make('name')
                    ->label('Nom')
                    ->searchable(),
                TextColumn::make('email')
                    ->label('E-mail')
                    ->searchable(),
                TextColumn::make('seats')
                    ->label('Places'),
                TextColumn::make('amount_cents')
                    ->label('Montant')
                    ->money('EUR', divideBy: 100),
                TextColumn::make('status')
                    ->label('Statut')
                    ->badge(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Statut')
                    ->options(BookingStatus::class),
            ])
            ->defaultSort('created_at', 'desc')
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
