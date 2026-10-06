<?php

namespace App\Filament\Resources\Inquiries\Tables;

use App\Enums\InquiryStatus;
use App\Enums\InquiryType;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class InquiriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('created_at')
                    ->label('Reçue le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
                TextColumn::make('type')
                    ->label('Type')
                    ->badge(),
                TextColumn::make('name')
                    ->label('Nom')
                    ->searchable(),
                TextColumn::make('company')
                    ->label('Structure')
                    ->searchable(),
                TextColumn::make('email')
                    ->label('E-mail')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('participants')
                    ->label('Participants')
                    ->toggleable(),
                TextColumn::make('status')
                    ->label('Statut')
                    ->badge(),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->label('Type')
                    ->options(InquiryType::class),
                SelectFilter::make('status')
                    ->label('Statut')
                    ->options(InquiryStatus::class),
            ])
            ->defaultSort('created_at', 'desc')
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
