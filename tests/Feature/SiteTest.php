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
            ->has('latestPosts', 2)
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

    $this->get(route('podcasts.offers'))
        ->assertInertia(fn (Assert $page) => $page->component('podcasts/offers'));
});

it('lists only published experiences', function () {
    Experience::where('slug', 'atelier-anti-gaspi')->update(['is_published' => false]);

    $this->get(route('experiences.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('experiences/index')
            ->has('experiences', 4)
            ->where('experiences.0.price_from', 70)
            ->where('experiences.0.type.value', 'atelier'));

    $this->get(route('experiences.show', 'atelier-anti-gaspi'))->assertNotFound();
});

it('shows an experience with its upcoming sessions and matching testimonials', function () {
    Testimonial::create(['author_name' => 'Léa', 'quote' => 'Top.', 'experience_type' => ExperienceType::Atelier, 'is_published' => true]);

    $this->get(route('experiences.show', 'good-tour-croix-rousse'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('experiences/show')
            ->where('experience.title', 'La Croix-Rousse')
            ->has('sessions', 2)
            ->where('sessions.0.price', 60)
            ->has('sessions.0.remaining_seats')
            ->has('testimonials', 3));

    $this->get(route('experiences.show', 'immersion-a-la-ferme'))
        ->assertInertia(fn (Assert $page) => $page->has('sessions', 0)->where('experience.price_from', null));
});

it('hides draft and scheduled posts', function () {
    Post::create(['title' => 'Plus tard', 'slug' => 'plus-tard', 'body' => '<p>…</p>', 'published_at' => now()->addWeek()]);

    $this->get(route('posts.index'))
        ->assertInertia(fn (Assert $page) => $page->component('posts/index')->has('posts', 2));

    $this->get(route('posts.show', 'team-building-good-tour'))
        ->assertInertia(fn (Assert $page) => $page->component('posts/show')->has('post.body'));

    $this->get(route('posts.show', 'lactofermentation-par-ou-commencer'))->assertNotFound();
    $this->get(route('posts.show', 'plus-tard'))->assertNotFound();
});

it('renders the about and contact pages', function () {
    $this->get(route('about'))
        ->assertInertia(fn (Assert $page) => $page->component('about')->has('settings.about_text'));

    $this->get(route('contact', ['type' => 'devis_experience', 'experience_type' => 'food_tour']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('contact')
            ->where('defaultType', 'devis_experience')
            ->where('defaultExperienceType', 'food_tour')
            ->has('inquiryTypes', 3)
            ->has('experienceTypes', 3));

    $this->get(route('contact', ['type' => 'nimporte']))
        ->assertInertia(fn (Assert $page) => $page->where('defaultType', 'contact'));
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
    ])->assertRedirect(route('contact'));

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
    $this->get(route('experiences.show', 'atelier-lactofermentation'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('sessions.0.starts_at', fn (string $value) => (bool) preg_match('/T18:30:00\\+0[12]:00$/', $value)));
});

it('sends a null speaker for a podcast without intervenant', function () {
    $podcast = Podcast::create(['title' => 'Hors-série', 'slug' => 'hors-serie', 'link' => 'https://smartlink.ausha.co/la-recette']);

    $this->get(route('podcasts.show', $podcast))
        ->assertInertia(fn (Assert $page) => $page->where('podcast.speaker', null)->where('podcast.quote', null));
});
