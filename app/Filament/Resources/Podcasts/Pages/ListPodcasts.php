<?php

namespace App\Filament\Resources\Podcasts\Pages;

use App\Filament\Resources\Podcasts\PodcastResource;
use App\Services\Ausha\PodcastSynchronizer;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Icons\Heroicon;
use Throwable;

class ListPodcasts extends ListRecords
{
    protected static string $resource = PodcastResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // The same import runs every hour: this is for not waiting.
            Action::make('sync')
                ->label('Synchroniser avec Ausha')
                ->icon(Heroicon::OutlinedArrowPath)
                ->color('gray')
                ->action(function (PodcastSynchronizer $synchronizer): void {
                    try {
                        $result = $synchronizer->sync();
                    } catch (Throwable $exception) {
                        report($exception);

                        Notification::make()->danger()->title('Synchronisation impossible')->body($exception->getMessage())->send();

                        return;
                    }

                    Notification::make()
                        ->success()
                        ->title('Podcasts à jour')
                        ->body("{$result['created']} épisode(s) importé(s), {$result['updated']} mis à jour.")
                        ->send();
                }),
            CreateAction::make(),
        ];
    }
}
