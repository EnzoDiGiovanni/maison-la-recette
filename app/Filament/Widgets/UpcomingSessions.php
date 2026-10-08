<?php

namespace App\Filament\Widgets;

use App\Enums\BookingStatus;
use App\Filament\Resources\ExperienceSessions\ExperienceSessionResource;
use App\Models\ExperienceSession;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class UpcomingSessions extends TableWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('Prochaines sessions')
            ->query(
                ExperienceSession::query()
                    ->upcoming()
                    ->with('experience')
                    ->withSum(['bookings as paid_seats' => fn (Builder $query) => $query->where('status', BookingStatus::Paid)], 'seats')
                    ->limit(5),
            )
            ->columns([
                TextColumn::make('starts_at')
                    ->label('Date')
                    ->dateTime('d/m/Y H:i'),
                TextColumn::make('experience.title')
                    ->label('Expérience'),
                TextColumn::make('location')
                    ->label('Lieu')
                    ->placeholder('—'),
                TextColumn::make('paid_seats')
                    ->label('Places réservées')
                    ->state(fn (ExperienceSession $record): string => ((int) $record->getAttribute('paid_seats')).' / '.$record->capacity),
            ])
            ->recordUrl(fn (ExperienceSession $record): string => ExperienceSessionResource::getUrl('edit', ['record' => $record]))
            ->paginated(false)
            ->emptyStateHeading('Aucune session à venir');
    }
}
