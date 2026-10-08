<?php

namespace App\Filament\Resources\ExperienceSessions\Tables;

use App\Enums\SessionStatus;
use App\Filament\Support\BookedRecordGuard;
use App\Models\ExperienceSession;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ExperienceSessionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('starts_at')
                    ->label('Date')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
                TextColumn::make('experience.title')
                    ->label('Expérience')
                    ->searchable(),
                TextColumn::make('location')
                    ->label('Lieu')
                    ->toggleable(),
                TextColumn::make('capacity')
                    ->label('Places'),
                TextColumn::make('paid_seats')
                    ->label('Réservées')
                    ->state(fn (ExperienceSession $record): int => $record->capacity - $record->remainingSeats()),
                TextColumn::make('price_cents')
                    ->label('Prix')
                    ->money('EUR', divideBy: 100),
                TextColumn::make('status')
                    ->label('Statut')
                    ->badge(),
            ])
            ->filters([
                SelectFilter::make('experience')
                    ->label('Expérience')
                    ->relationship('experience', 'title'),
                SelectFilter::make('status')
                    ->label('Statut')
                    ->options(SessionStatus::class),
            ])
            ->defaultSort('starts_at', 'desc')
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    BookedRecordGuard::deleteBulkAction(),
                ]),
            ]);
    }
}
