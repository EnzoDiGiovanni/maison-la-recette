<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Inquiries\InquiryResource;
use App\Models\Inquiry;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestInquiries extends TableWidget
{
    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('Dernières demandes')
            ->query(Inquiry::query()->latest()->limit(5))
            ->columns([
                TextColumn::make('created_at')
                    ->label('Reçue le')
                    ->dateTime('d/m/Y H:i'),
                TextColumn::make('type')
                    ->label('Type')
                    ->badge(),
                TextColumn::make('name')
                    ->label('Nom'),
                TextColumn::make('company')
                    ->label('Structure')
                    ->placeholder('—'),
                TextColumn::make('status')
                    ->label('Statut')
                    ->badge(),
            ])
            ->recordUrl(fn (Inquiry $record): string => InquiryResource::getUrl('edit', ['record' => $record]))
            ->paginated(false)
            ->emptyStateHeading('Aucune demande pour le moment');
    }
}
