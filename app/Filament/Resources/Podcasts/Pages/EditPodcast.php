<?php

namespace App\Filament\Resources\Podcasts\Pages;

use App\Filament\Resources\Podcasts\PodcastResource;
use App\Models\Podcast;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPodcast extends EditRecord
{
    protected static string $resource = PodcastResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // An imported episode would come back with the next import.
            DeleteAction::make()
                ->hidden(fn (Podcast $record): bool => $record->isImported()),
        ];
    }
}
