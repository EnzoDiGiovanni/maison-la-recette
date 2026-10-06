<?php

namespace App\Filament\Resources\ExperienceSessions\Pages;

use App\Filament\Resources\ExperienceSessions\ExperienceSessionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListExperienceSessions extends ListRecords
{
    protected static string $resource = ExperienceSessionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
