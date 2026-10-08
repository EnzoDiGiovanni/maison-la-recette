<?php

use App\Enums\BookingStatus;
use App\Enums\ExperienceType;
use App\Enums\InquiryStatus;
use App\Enums\InquiryType;
use App\Filament\Pages\ManageSettings;
use App\Filament\Resources\Bookings\BookingResource;
use App\Filament\Resources\Experiences\ExperienceResource;
use App\Filament\Resources\Experiences\Pages\CreateExperience;
use App\Filament\Resources\Experiences\Pages\EditExperience;
use App\Filament\Resources\ExperienceSessions\ExperienceSessionResource;
use App\Filament\Resources\ExperienceSessions\Pages\CreateExperienceSession;
use App\Filament\Resources\ExperienceSessions\Pages\EditExperienceSession;
use App\Filament\Resources\ExperienceSessions\Pages\ListExperienceSessions;
use App\Filament\Resources\Inquiries\InquiryResource;
use App\Filament\Resources\Podcasts\Pages\CreatePodcast;
use App\Filament\Resources\Podcasts\PodcastResource;
use App\Filament\Resources\Posts\PostResource;
use App\Filament\Resources\Speakers\SpeakerResource;
use App\Filament\Resources\Testimonials\TestimonialResource;
use App\Models\Booking;
use App\Models\Experience;
use App\Models\ExperienceSession;
use App\Models\Inquiry;
use App\Models\Podcast;
use App\Models\Post;
use App\Models\Setting;
use App\Models\Speaker;
use App\Models\Testimonial;
use App\Models\User;
use Filament\Forms\Components\Repeater;
use Livewire\Livewire;

beforeEach(function () {
    $this->actingAs(User::factory()->admin()->create());

    $experience = Experience::create([
        'type' => ExperienceType::Atelier,
        'title' => 'Lactofermentation',
        'slug' => 'lactofermentation',
        'highlights' => ['Composez vos bocaux'],
        'price_from_cents' => 7000,
    ]);

    $session = ExperienceSession::create([
        'experience_id' => $experience->id,
        'starts_at' => now()->addWeek(),
        'capacity' => 10,
        'price_cents' => 7000,
    ]);

    $booking = Booking::create([
        'experience_session_id' => $session->id,
        'name' => 'Marie',
        'email' => 'marie@example.com',
        'seats' => 3,
        'amount_cents' => 21000,
        'status' => BookingStatus::Paid,
    ]);

    $this->records = [
        SpeakerResource::class => $speaker = Speaker::create(['name' => 'Charles Guirriec', 'role' => 'La pêche durable']),
        PodcastResource::class => Podcast::create([
            'speaker_id' => $speaker->id,
            'title' => 'La pêche durable',
            'slug' => 'la-peche-durable',
            'season' => 3,
            'link' => 'https://podcast.ausha.co/la-recette/la-peche-durable',
            'iframe' => '<iframe src="https://player.ausha.co/?podcastId=abc"></iframe>',
            'published_at' => now(),
        ]),
        ExperienceResource::class => $experience,
        ExperienceSessionResource::class => $session,
        BookingResource::class => $booking,
        InquiryResource::class => Inquiry::create([
            'type' => InquiryType::ExperienceQuote,
            'name' => 'Bruno',
            'email' => 'bruno@example.com',
            'company' => 'Acme',
            'experience_type' => ExperienceType::FoodTour,
            'participants' => 12,
            'message' => 'Un good tour pour notre équipe.',
        ]),
        TestimonialResource::class => Testimonial::create([
            'author_name' => 'Anouck',
            'quote' => 'Un super concept.',
        ]),
        PostResource::class => Post::create([
            'title' => 'Premier article',
            'slug' => 'premier-article',
            'body' => '<p>Bonjour</p>',
        ]),
    ];
});

it('renders the list and edit pages of every resource', function () {
    foreach ($this->records as $resource => $record) {
        $this->get($resource::getUrl('index'))->assertOk();
        $this->get($resource::getUrl('edit', ['record' => $record]))->assertOk();
    }
});

it('renders the create pages', function () {
    foreach ([PodcastResource::class, SpeakerResource::class, ExperienceResource::class, ExperienceSessionResource::class, TestimonialResource::class, PostResource::class] as $resource) {
        $this->get($resource::getUrl('create'))->assertOk();
    }
});

it('does not let bookings and inquiries be created from the back office', function () {
    expect(BookingResource::canCreate())->toBeFalse()
        ->and(InquiryResource::canCreate())->toBeFalse();
});

it('stores prices typed in euros as cents', function () {
    $undoRepeaterFake = Repeater::fake();

    Livewire::test(CreateExperience::class)
        ->fillForm([
            'type' => ExperienceType::FoodTour,
            'title' => 'La Croix-Rousse',
            'slug' => 'la-croix-rousse',
            'highlights' => [['highlight' => '4 étapes gourmandes']],
            'price_from_cents' => '60.50',
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    $undoRepeaterFake();

    $experience = Experience::where('slug', 'la-croix-rousse')->firstOrFail();

    expect($experience->price_from_cents)->toBe(6050)
        ->and($experience->highlights)->toBe(['4 étapes gourmandes']);
});

it('creates a podcast from a link and an iframe', function () {
    Livewire::test(CreatePodcast::class)
        ->fillForm([
            'title' => 'La boulangerie végétale',
            'slug' => 'la-boulangerie-vegetale',
            'link' => 'https://podcast.ausha.co/la-recette/la-boulangerie-vegetale',
            'iframe' => '<iframe src="https://player.ausha.co/?podcastId=xyz"></iframe>',
            'speaker_id' => $this->records[SpeakerResource::class]->id,
            'quote' => 'Le pain, c\'est vivant.',
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    $podcast = Podcast::where('slug', 'la-boulangerie-vegetale')->firstOrFail();

    expect($podcast->iframe)->toBe('<iframe src="https://player.ausha.co/?podcastId=xyz"></iframe>')
        ->and($podcast->speaker->name)->toBe('Charles Guirriec')
        ->and($podcast->quote)->toBe('Le pain, c\'est vivant.');
});

it('counts only paid bookings against the session capacity', function () {
    $session = $this->records[ExperienceSessionResource::class];

    Booking::create([
        'experience_session_id' => $session->id,
        'name' => 'Paul',
        'email' => 'paul@example.com',
        'seats' => 4,
        'amount_cents' => 28000,
    ]);

    expect($session->remainingSeats())->toBe(7);
});

it('shows the number of new inquiries in the navigation', function () {
    expect(InquiryResource::getNavigationBadge())->toBe('1');

    $this->records[InquiryResource::class]->update(['status' => InquiryStatus::Contacted]);

    expect(InquiryResource::getNavigationBadge())->toBeNull();
});

it('saves the site settings', function () {
    Setting::set('contact_email', 'ancien@example.com');

    Livewire::test(ManageSettings::class)
        ->assertSchemaStateSet(['contact_email' => 'ancien@example.com'])
        ->fillForm(['contact_email' => 'larecette@ecomail.fr', 'podcast_rating' => '4,9/5'])
        ->call('save')
        ->assertHasNoFormErrors();

    expect(Setting::get('contact_email'))->toBe('larecette@ecomail.fr')
        ->and(Setting::get('podcast_rating'))->toBe('4,9/5')
        ->and(Setting::get('inconnu', 'défaut'))->toBe('défaut');
});

it('switches the home banner on and off', function () {
    Livewire::test(ManageSettings::class)
        ->fillForm(['banner_enabled' => false, 'banner_text' => 'Nouveau défi en octobre'])
        ->call('save')
        ->assertHasNoFormErrors();

    expect(Setting::get('banner_enabled'))->toBe('0')
        ->and(Setting::get('banner_text'))->toBe('Nouveau défi en octobre');

    Livewire::test(ManageSettings::class)
        ->assertSchemaStateSet(['banner_enabled' => false])
        ->fillForm(['banner_enabled' => true])
        ->call('save');

    expect(Setting::get('banner_enabled'))->toBe('1');
});

it('refuses to delete a session or an experience that has bookings', function () {
    $session = $this->records[ExperienceSessionResource::class];
    $experience = $this->records[ExperienceResource::class];

    Livewire::test(EditExperienceSession::class, ['record' => $session->getRouteKey()])
        ->callAction('delete')
        ->assertNotified('Suppression impossible');

    Livewire::test(EditExperience::class, ['record' => $experience->getRouteKey()])
        ->callAction('delete')
        ->assertNotified('Suppression impossible');

    Livewire::test(ListExperienceSessions::class)
        ->callTableBulkAction('delete', [$session]);

    expect($session->fresh())->not->toBeNull()
        ->and($experience->fresh())->not->toBeNull();
});

it('still deletes a session without bookings', function () {
    $session = ExperienceSession::create([
        'experience_id' => $this->records[ExperienceResource::class]->id,
        'starts_at' => now()->addMonth(),
        'capacity' => 8,
        'price_cents' => 7000,
    ]);

    Livewire::test(EditExperienceSession::class, ['record' => $session->getRouteKey()])
        ->callAction('delete');

    expect($session->fresh())->toBeNull();
});

it('keeps the time typed in the back office as Paris time', function () {
    Livewire::test(CreateExperienceSession::class)
        ->fillForm([
            'experience_id' => $this->records[ExperienceResource::class]->id,
            'starts_at' => '2027-07-01 18:30',
            'capacity' => 10,
            'price_cents' => '70',
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    $session = ExperienceSession::latest('id')->firstOrFail();

    expect($session->starts_at->toIso8601String())->toBe('2027-07-01T18:30:00+02:00');
});

it('keeps the podcast when its intervenant is deleted', function () {
    $this->records[SpeakerResource::class]->delete();

    expect($this->records[PodcastResource::class]->fresh()->speaker_id)->toBeNull();
});
