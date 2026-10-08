<?php

use App\Enums\ExperienceType;
use App\Enums\InquiryStatus;
use App\Enums\InquiryType;
use App\Models\Experience;
use App\Models\Inquiry;
use App\Models\Podcast;
use App\Models\Post;
use App\Models\Testimonial;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(fn () => $this->seed());

it('renders the home page with featured podcasts, experiences, testimonials and posts', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->has('featuredPodcasts', 2)
            ->has('experiences', 5)
            ->has('testimonials', 3)
            ->has('latestPosts', 3)
            ->where('settings.contact_email', 'larecette@ecomail.fr')
            ->missing('settings.about_photo'));
});

it('lists the podcasts and shows one with its link and iframe', function () {
    $podcast = Podcast::firstOrFail();
    $podcast->update([
        'iframe' => '<iframe src="https://player.ausha.co/?podcastId=abc"></iframe>',
        'image' => 'podcasts/peche.jpg',
    ]);

    $this->get(route('podcasts.index'))
        ->assertInertia(fn (Assert $page) => $page->component('podcasts/index')->has('podcasts', 6)->has('podcasts.0.speaker.name'));

    $this->get(route('podcasts.show', $podcast))
        ->assertInertia(fn (Assert $page) => $page
            ->component('podcasts/show')
            ->where('podcast.slug', $podcast->slug)
            ->where('podcast.link', $podcast->link)
            ->where('podcast.iframe', $podcast->iframe)
            ->where('podcast.speaker.name', $podcast->speaker->name)
            ->where('podcast.speaker.role', $podcast->speaker->role)
            ->where('podcast.speaker.photo_url', null)
            ->has('podcast.quote')
            ->where('podcast.image_url', Storage::disk('public')->url('podcasts/peche.jpg')));
});

it('lists only published experiences', function () {
    Experience::where('slug', 'atelier-anti-gaspi')->update(['is_published' => false]);

    $this->get(route('experiences.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('experiences/index')
            ->where('types', [
                ['slug' => 'ateliers', 'label' => 'Les ateliers'],
                ['slug' => 'good-tours', 'label' => 'Les good tours'],
                ['slug' => 'immersions', 'label' => 'Les immersions'],
            ])
            ->where('spotlight.slug', 'atelier-lactofermentation'));

    $this->get(route('experiences.listing', 'ateliers'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('experiences/listing')
            ->where('type.label', 'Les ateliers')
            ->has('sessions', 2)
            ->where('sessions.0.experience.slug', 'atelier-lactofermentation')
            ->where('sessions.0.price', 70)
            ->has('pastEvents', 1)
            // The general review only: the two others are about food tours.
            ->has('testimonials', 1)
            ->where('testimonials.0.experience_title', null)
            ->where('testimonials.0.rating', 5));

    $this->get(route('experiences.listing', 'good-tours'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('testimonials', 3)
            ->where('testimonials.0.experience_title', 'La Croix-Rousse')
            ->where('testimonials.1.experience_title', 'Jean-Macé'));

    // Its dates cannot be opened either.
    $this->get(route('sessions.show', Experience::where('slug', 'atelier-anti-gaspi')->sole()->upcomingSessions()->firstOrFail()))->assertNotFound();
});

it('lists every upcoming date in the agenda and none for quote-only formats', function () {
    $this->get(route('experiences.agenda'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('experiences/listing')
            ->where('type', null)
            ->has('sessions', 8)
            ->has('testimonials', 3));

    $this->get(route('experiences.listing', 'immersions'))
        ->assertInertia(fn (Assert $page) => $page->has('sessions', 0)->has('pastEvents', 0));

    $this->get('/experiences/inconnu')->assertNotFound();
});

it('shows the reservation step of an open upcoming date only', function () {
    $session = Experience::where('slug', 'good-tour-jean-mace')->sole()->upcomingSessions()->firstOrFail();

    $this->get(route('sessions.show', $session))
        ->assertInertia(fn (Assert $page) => $page
            ->component('bookings/show')
            ->where('experience.title', 'Jean-Macé')
            ->where('session.price', 60)
            ->where('session.remaining_seats', 12));

    $session->update(['starts_at' => now()->subDay()]);
    $this->get(route('sessions.show', $session))->assertNotFound();
});

it('shows the reviews of a format with those about its experiences', function () {
    Testimonial::create(['author_name' => 'Léa', 'quote' => 'Top.', 'experience_type' => ExperienceType::Atelier, 'is_published' => true]);

    $this->get(route('experiences.listing', 'ateliers'))
        ->assertInertia(fn (Assert $page) => $page->has('testimonials', 2));

    $this->get(route('experiences.listing', 'immersions'))
        ->assertInertia(fn (Assert $page) => $page->has('testimonials', 1)->where('testimonials.0.author_name', 'Marie'));

    // A review follows its experience: hidden everywhere once it is unpublished.
    Experience::where('slug', 'good-tour-jean-mace')->update(['is_published' => false]);

    $this->get(route('experiences.listing', 'good-tours'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('testimonials', 2)
            ->where('testimonials', fn ($testimonials) => ! collect($testimonials)->contains('author_name', 'Anouck')));

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page->has('testimonials', 3));

    // The old detail pages are gone: the reservation step carries the detail.
    $this->get('/experiences/good-tour-croix-rousse')->assertNotFound();
});

it('hides draft and scheduled posts', function () {
    Post::create(['title' => 'Plus tard', 'slug' => 'plus-tard', 'body' => '<p>…</p>', 'published_at' => now()->addWeek()]);

    $this->get(route('posts.index'))
        ->assertInertia(fn (Assert $page) => $page->component('posts/index')->has('posts', 7));

    $this->get(route('posts.show', 'team-building-good-tour'))
        ->assertInertia(fn (Assert $page) => $page->component('posts/show')->has('post.body')->has('otherPosts', 3));

    $this->get(route('posts.show', 'lactofermentation-par-ou-commencer'))->assertNotFound();
    $this->get(route('posts.show', 'plus-tard'))->assertNotFound();
});

it('renders the about and contact pages', function () {
    $this->get(route('about'))
        ->assertInertia(fn (Assert $page) => $page->component('about')->has('settings.about_text'));

    $this->get(route('studio'))
        ->assertInertia(fn (Assert $page) => $page->component('studio'));

    $this->get(route('contact'))
        ->assertInertia(fn (Assert $page) => $page->component('contact'));

    // Anciens liens ?type= : renvoyés vers le bon formulaire de devis.
    $this->get(route('contact', ['type' => 'devis_experience']))
        ->assertRedirect(route('contact.quote.experience'));
    $this->get(route('contact', ['type' => 'devis_podcast']))
        ->assertRedirect(route('contact.quote.podcast'));

    // Chaque devis a sa propre page : aucune ne propose l'autre type.
    $this->get(route('contact.quote.experience', ['experience_type' => 'food_tour']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('devis/experience')
            ->where('defaultExperienceType', 'food_tour')
            ->has('experienceTypes', 3));

    $this->get(route('contact.quote.podcast'))
        ->assertInertia(fn (Assert $page) => $page->component('devis/podcast'));
});

it('stores a quote request as a new inquiry', function () {
    Inquiry::query()->delete();

    $this->post(route('contact.store'), [
        'type' => 'devis_experience',
        'name' => 'Laure',
        'email' => 'laure@example.com',
        'phone' => '',
        'company' => 'Acme',
        'experience_type' => 'food_tour',
        'participants' => '15',
        'desired_date' => now()->addMonth()->toDateString(),
        'venue' => '',
        'message' => 'Un good tour pour notre équipe.',
    ])->assertRedirect('/');

    $inquiry = Inquiry::sole();

    expect($inquiry->type)->toBe(InquiryType::ExperienceQuote)
        ->and($inquiry->status)->toBe(InquiryStatus::New)
        ->and($inquiry->experience_type)->toBe(ExperienceType::FoodTour)
        ->and($inquiry->participants)->toBe(15)
        ->and($inquiry->phone)->toBeNull();
});

it('rejects an invalid contact message', function () {
    Inquiry::query()->delete();

    $this->post(route('contact.store'), [
        'type' => 'spam',
        'name' => '',
        'email' => 'pas-un-email',
        'message' => '',
        'status' => 'won',
    ])->assertSessionHasErrors(['type', 'name', 'email', 'message']);

    expect(Inquiry::count())->toBe(0);
});

it('ignores quote fields left over when the visitor switches back to a plain contact', function () {
    Inquiry::query()->delete();

    $this->post(route('contact.store'), [
        'type' => 'contact',
        'name' => 'Martine',
        'email' => 'martine@example.com',
        'company' => 'Acme',
        'experience_type' => 'food_tour',
        'participants' => '0',
        'desired_date' => now()->toDateString(),
        'venue' => 'Lyon 3',
        'message' => 'Proposez-vous des bons cadeaux ?',
    ])->assertSessionHasNoErrors();

    $inquiry = Inquiry::sole();

    expect($inquiry->type)->toBe(InquiryType::Contact)
        ->and($inquiry->experience_type)->toBeNull()
        ->and($inquiry->company)->toBeNull()
        ->and($inquiry->participants)->toBeNull()
        ->and($inquiry->desired_date)->toBeNull();
});

it('sends session times with the Paris offset', function () {
    $this->get(route('experiences.listing', 'ateliers'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('sessions.0.starts_at', fn (string $value) => (bool) preg_match('/T18:30:00\\+0[12]:00$/', $value)));
});

it('sends a null speaker for a podcast without intervenant', function () {
    $podcast = Podcast::create(['title' => 'Hors-série', 'slug' => 'hors-serie', 'link' => 'https://smartlink.ausha.co/la-recette']);

    $this->get(route('podcasts.show', $podcast))
        ->assertInertia(fn (Assert $page) => $page->where('podcast.speaker', null)->where('podcast.quote', null));
});

it('sends the past dates of published experiences to the agenda and keeps empty formats off the menu', function () {
    Experience::create(['type' => ExperienceType::Atelier, 'title' => 'Brouillon', 'slug' => 'brouillon']);
    Experience::where('type', ExperienceType::Immersion)->update(['is_published' => false]);

    $this->get(route('experiences.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('types', 2)
            ->where('types.1.slug', 'good-tours'));

    $this->get(route('experiences.agenda'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('pastEvents', 4)
            ->has('pastEvents.0.experience.title')
            ->where('pastEvents.0.starts_at', fn (string $value) => now()->gt($value)));
});
