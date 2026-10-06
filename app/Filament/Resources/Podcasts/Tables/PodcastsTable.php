<?php

namespace App\Filament\Resources\Podcasts\Tables;

use App\Models\Podcast;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PodcastsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('season')
                    ->label('Saison')
                    ->sortable(),
                TextColumn::make('number')
                    ->label('N°')
                    ->sortable(),
                TextColumn::make('title')
                    ->label('Titre')
                    ->searchable()
                    ->wrap(),
                IconColumn::make('iframe')
                    ->label('Iframe')
                    ->boolean()
                    ->state(fn (Podcast $record): bool => filled($record->iframe)),
                IconColumn::make('is_featured')
                    ->label('À la une')
                    ->boolean(),
                TextColumn::make('published_at')
                    ->label('Publié le')
                    ->date('d/m/Y')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('season')
                    ->label('Saison')
                    ->options(fn (): array => Podcast::query()->whereNotNull('season')->distinct()->orderBy('season')->pluck('season', 'season')->all()),
            ])
            ->defaultSort('published_at', 'desc')
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
