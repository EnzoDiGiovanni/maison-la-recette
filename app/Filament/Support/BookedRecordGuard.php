<?php

namespace App\Filament\Support;

use App\Models\Experience;
use App\Models\ExperienceSession;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Notifications\Notification;

/**
 * Delete actions for records that bookings point to. The database refuses to
 * delete them, so the back office explains why instead of failing.
 */
class BookedRecordGuard
{
    public const string MESSAGE = 'Des réservations y sont rattachées. Passez plutôt la session en « Annulée » ou masquez l\'expérience du site.';

    public static function deleteAction(): DeleteAction
    {
        return DeleteAction::make()
            ->before(function (DeleteAction $action, Experience|ExperienceSession $record): void {
                if (! $record->hasBookings()) {
                    return;
                }

                Notification::make()
                    ->danger()
                    ->title('Suppression impossible')
                    ->body(self::MESSAGE)
                    ->send();

                $action->halt();
            });
    }

    public static function deleteBulkAction(): DeleteBulkAction
    {
        return DeleteBulkAction::make()
            ->authorizeIndividualRecords(fn (Experience|ExperienceSession $record): bool => ! $record->hasBookings())
            ->missingBulkAuthorizationFailureNotificationMessage(self::MESSAGE);
    }
}
