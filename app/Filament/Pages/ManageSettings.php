<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

/**
 * @property-read Schema $form
 */
class ManageSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static ?string $navigationLabel = 'Réglages';

    protected static ?string $title = 'Réglages du site';

    protected static ?string $slug = 'reglages';

    protected static ?int $navigationSort = 100;

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(Setting::values());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->statePath('data')
            ->components([
                Section::make('Chiffres du podcast')
                    ->columns(2)
                    ->schema([
                        TextInput::make('podcast_rating')
                            ->label('Note moyenne')
                            ->placeholder('4,9/5'),
                        TextInput::make('podcast_reviews_count')
                            ->label('Nombre d\'avis')
                            ->placeholder('70'),
                        TextInput::make('podcast_listen_rate')
                            ->label('Taux d\'écoute moyen')
                            ->placeholder('75 %'),
                        TextInput::make('podcast_total_listens')
                            ->label('Écoutes cumulées')
                            ->placeholder('+ de 50 000'),
                        TextInput::make('podcast_episodes_count')
                            ->label('Nombre d\'épisodes')
                            ->placeholder('+ 40'),
                    ]),
                Section::make('Plateformes d\'écoute')
                    ->columns(2)
                    ->schema([
                        TextInput::make('link_ausha')->label('Ausha')->url(),
                        TextInput::make('link_spotify')->label('Spotify')->url(),
                        TextInput::make('link_apple_podcasts')->label('Apple Podcasts')->url(),
                        TextInput::make('link_deezer')->label('Deezer')->url(),
                        TextInput::make('link_youtube')->label('YouTube')->url(),
                    ]),
                Section::make('Contact et réseaux')
                    ->columns(2)
                    ->schema([
                        TextInput::make('contact_email')->label('E-mail de contact')->email(),
                        TextInput::make('link_instagram')->label('Instagram')->url(),
                        TextInput::make('link_linkedin')->label('LinkedIn')->url(),
                    ]),
                Section::make('Page À propos')
                    ->schema([
                        Textarea::make('about_text')
                            ->label('Texte')
                            ->rows(10),
                        FileUpload::make('about_photo')
                            ->label('Photo')
                            ->image()
                            ->disk('public')
                            ->directory('about'),
                    ]),
            ]);
    }

    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                Form::make([EmbeddedSchema::make('form')])
                    ->id('form')
                    ->livewireSubmitHandler('save')
                    ->footer([
                        Actions::make([
                            Action::make('save')
                                ->label('Enregistrer')
                                ->submit('save')
                                ->keyBindings(['mod+s']),
                        ]),
                    ]),
            ]);
    }

    public function save(): void
    {
        /** @var array<string, string|null> $data */
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        Notification::make()
            ->success()
            ->title('Réglages enregistrés')
            ->send();
    }
}
