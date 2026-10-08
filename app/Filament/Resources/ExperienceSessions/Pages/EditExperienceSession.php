<?php

namespace App\Filament\Resources\ExperienceSessions\Pages;

use App\Filament\Resources\ExperienceSessions\ExperienceSessionResource;
use App\Filament\Support\BookedRecordGuard;
use Filament\Resources\Pages\EditRecord;

class EditExperienceSession extends EditRecord
{
    protected static string $resource = ExperienceSessionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            BookedRecordGuard::deleteAction(),
        ];
    }
}
