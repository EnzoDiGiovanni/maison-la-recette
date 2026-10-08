<?php

use App\Enums\ExperienceType;
use App\Filament\Resources\Bookings\BookingResource;
use App\Filament\Resources\Experiences\ExperienceResource;
use App\Filament\Resources\ExperienceSessions\ExperienceSessionResource;
use App\Filament\Resources\Inquiries\InquiryResource;
use App\Filament\Resources\Podcasts\PodcastResource;
use App\Filament\Resources\Posts\PostResource;
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
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    $this->feedDown = false;

    // The podcast seeder imports the Ausha feed.
    Http::fake([
        'feed.ausha.co/*' => fn () => $this->feedDown
            ? Http::response('', 503)
            : Http::response((string) file_get_contents(base_path('tests/Fixtures/ausha-feed.xml'))),
        'image.ausha.co/*' => Http::response('cover', 200, ['Content-Type' => 'image/jpeg']),
    ]);
});

it('seeds demo data for every resource without duplicating on a second run', function () {
    $counts = fn (): array => [
        Podcast::count(), Speaker::count(), Experience::count(), ExperienceSession::count(), Booking::count(),
        Inquiry::count(), Testimonial::count(), Post::count(), Setting::count(), User::count(),
    ];

    $this->seed();
    $afterFirstRun = $counts();
    $this->seed();

    expect($afterFirstRun)->each->toBeGreaterThan(0)
        ->and($counts())->toBe($afterFirstRun);
});

it('gives sessions to every experience except immersions', function () {
    $this->seed();

    Experience::all()->each(function (Experience $experience) {
        expect($experience->sessions()->exists())->toBe($experience->type !== ExperienceType::Immersion);
    });

    expect(ExperienceSession::where('starts_at', '>', now())->count())->toBeGreaterThan(0)
        ->and(Booking::all())->each(fn ($booking) => $booking->amount_cents->toBe($booking->value->seats * $booking->value->session->price_cents));
});

it('renders the back office lists with the seeded data', function () {
    $this->seed();
    $this->actingAs(User::firstOrFail());

    foreach ([PodcastResource::class, ExperienceResource::class, ExperienceSessionResource::class, BookingResource::class, InquiryResource::class, TestimonialResource::class, PostResource::class] as $resource) {
        $this->get($resource::getUrl('index'))->assertOk();
    }
});

it('does not overwrite back office edits when seeding again', function () {
    $this->seed();

    Setting::set('contact_email', 'nouveau@example.com');
    Post::where('slug', '5-episodes-a-deguster')->update(['title' => 'Titre corrigé']);
    Experience::where('slug', 'atelier-anti-gaspi')->update(['is_published' => false]);

    $this->seed();

    expect(Setting::get('contact_email'))->toBe('nouveau@example.com')
        ->and(Post::where('slug', '5-episodes-a-deguster')->value('title'))->toBe('Titre corrigé')
        ->and(Experience::where('slug', 'atelier-anti-gaspi')->value('is_published'))->toBeFalse();
});

it('refuses to seed in production', function () {
    app()->detectEnvironment(fn () => 'production');

    expect(fn () => app(DatabaseSeeder::class)->run())->toThrow(RuntimeException::class);

    expect(User::count())->toBe(0);
});

it('imports the real episodes, linked to their intervenant, instead of demo ones', function () {
    $this->seed();

    $episode = Podcast::where('title', 'like', 'Charles Guirriec%')->firstOrFail();

    expect(Podcast::whereNull('ausha_guid')->count())->toBe(0)
        ->and($episode->speaker->name)->toBe('Charles Guirriec')
        ->and($episode->is_featured)->toBeTrue()
        // Only the Pédron episode of the fixture has a cover to take a portrait from.
        ->and($episode->speaker->photo)->toBeNull()
        ->and(Speaker::where('name', 'Jean-Marie Pédron')->sole()->photo)->toBe('speakers/jean-marie-pedron.jpg')
        ->and(Storage::disk('public')->exists('speakers/jean-marie-pedron.jpg'))->toBeTrue()
        ->and(Podcast::where('title', 'like', '%EXTRAIT%')->where('is_featured', true)->count())->toBe(0);
});

it('still seeds everything else when the Ausha feed is down', function () {
    $this->feedDown = true;

    $this->seed();

    expect(Podcast::count())->toBe(0)
        ->and(Experience::count())->toBeGreaterThan(0);
});

it('fills the sessions that took place with about ten participants', function () {
    $this->seed();

    $past = ExperienceSession::where('starts_at', '<', now())->get();

    expect($past->count())->toBe(5)
        ->and($past)->each(fn ($session) => $session->remainingSeats()->toBeLessThanOrEqual(2));
});
