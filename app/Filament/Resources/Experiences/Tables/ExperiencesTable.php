<?php

namespace App\Filament\Resources\Experiences\Tables;

use App\Enums\ExperienceType;
use App\Filament\Support\BookedRecordGuard;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ExperiencesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('cover_image')
                    ->label('Photo')
                    ->disk('public'),
                TextColumn::make('title')
                    ->label('Titre')
                    ->searchable(),
                TextColumn::make('type')
                    ->label('Format')
                    ->badge(),
                TextColumn::make('price_from_cents')
                    ->label('À partir de')
                    ->money('EUR', divideBy: 100)
                    ->placeholder('Sur devis'),
                TextColumn::make('sessions_count')
                    ->label('Sessions')
                    ->counts('sessions'),
                IconColumn::make('is_published')
                    ->label('Visible')
                    ->boolean(),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->label('Format')
                    ->options(ExperienceType::class),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
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
