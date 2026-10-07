<?php

namespace App\Filament\Resources\Podcasts\Tables;

use App\Filament\Resources\Podcasts\Schemas\PodcastForm;
use App\Models\Podcast;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PodcastsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->label('Image')
                    ->disk('public'),
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
                TextColumn::make('speaker.name')
                    ->label('Intervenant')
                    ->searchable()
                    ->placeholder('—'),
                IconColumn::make('audio_url')
                    ->label('Lecteur')
                    ->boolean()
                    ->state(fn (Podcast $record): bool => filled($record->audio_url) || filled($record->iframe)),
                IconColumn::make('is_featured')
                    ->label('À la une')
                    ->boolean(),
                IconColumn::make('is_published')
                    ->label('Visible')
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
                    DeleteBulkAction::make()
                        ->authorizeIndividualRecords(fn (Podcast $record): bool => ! $record->isImported())
                        ->missingBulkAuthorizationFailureNotificationMessage(PodcastForm::IMPORTED_MESSAGE),
                ]),
            ]);
    }
}
