<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
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
                Section::make('Bannière de la page d\'accueil')
                    ->description('Bandeau vert défilant, fixé en bas de l\'écran sur la page d\'accueil.')
                    ->columns(2)
                    ->schema([
                        Toggle::make('banner_enabled')
                            ->label('Afficher la bannière')
                            ->columnSpanFull(),
                        TextInput::make('banner_link_label')
                            ->label('Texte du lien')
                            ->placeholder('Inscris-toi')
                            ->helperText('Début de la phrase, souligné et cliquable. Facultatif.')
                            ->maxLength(60),
                        TextInput::make('banner_link_url')
                            ->label('Adresse du lien')
                            ->url()
                            ->helperText('Vide : le lien mène à la page d\'inscription.'),
                        TextInput::make('banner_text')
                            ->label('Texte')
                            ->placeholder('et lance-toi dans les défis durables de Maison La Recette')
                            ->maxLength(200)
                            ->columnSpanFull(),
                    ]),
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
                    ->description('Une plateforme sans lien n\'apparaît pas sur le site.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('link_ausha')->label('Ausha')->helperText('Lien général de l\'émission (icône micro de l\'en-tête).')->url()->columnSpanFull(),
                        TextInput::make('link_apple_podcasts')->label('Apple Podcasts')->url(),
                        TextInput::make('link_overcast')->label('Overcast')->url(),
                        TextInput::make('link_podcast_addict')->label('Podcast Addict')->url(),
                        TextInput::make('link_spotify')->label('Spotify')->url(),
                        TextInput::make('link_deezer')->label('Deezer')->url(),
                        TextInput::make('link_amazon_music')->label('Amazon Music')->url(),
                        TextInput::make('link_castbox')->label('Castbox')->url(),
                        TextInput::make('link_castro')->label('Castro')->url(),
                        TextInput::make('link_pocket_casts')->label('Pocket Casts')->url(),
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
        /** @var array<string, string|bool|null> $data */
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            // Settings are stored as text: a toggle becomes '1' or '0'.
            Setting::set($key, is_bool($value) ? ($value ? '1' : '0') : $value);
        }

        Notification::make()
            ->success()
            ->title('Réglages enregistrés')
            ->send();
    }
}
