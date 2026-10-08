<?php

namespace App\Filament\Resources\ExperienceSessions;

use App\Filament\Resources\ExperienceSessions\Pages\CreateExperienceSession;
use App\Filament\Resources\ExperienceSessions\Pages\EditExperienceSession;
use App\Filament\Resources\ExperienceSessions\Pages\ListExperienceSessions;
use App\Filament\Resources\ExperienceSessions\Schemas\ExperienceSessionForm;
use App\Filament\Resources\ExperienceSessions\Tables\ExperienceSessionsTable;
use App\Models\ExperienceSession;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ExperienceSessionResource extends Resource
{
    protected static ?string $model = ExperienceSession::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCalendarDays;

    protected static string|UnitEnum|null $navigationGroup = 'Expériences';

    protected static ?int $navigationSort = 2;

    protected static ?string $modelLabel = 'session';

    protected static ?string $pluralModelLabel = 'sessions';

    public static function form(Schema $schema): Schema
    {
        return ExperienceSessionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ExperienceSessionsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListExperienceSessions::route('/'),
            'create' => CreateExperienceSession::route('/create'),
            'edit' => EditExperienceSession::route('/{record}/edit'),
        ];
    }
}
