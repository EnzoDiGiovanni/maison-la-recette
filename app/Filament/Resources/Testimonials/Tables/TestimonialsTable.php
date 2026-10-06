<?php

namespace App\Filament\Resources\Testimonials\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TestimonialsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('author_name')
                    ->label('Prénom')
                    ->searchable(),
                TextColumn::make('author_role')
                    ->label('Fonction'),
                TextColumn::make('quote')
                    ->label('Avis')
                    ->limit(80)
                    ->wrap(),
                TextColumn::make('experience_type')
                    ->label('Format')
                    ->badge(),
                IconColumn::make('is_published')
                    ->label('Visible')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
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
