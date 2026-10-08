<?php

use App\Filament\Resources\Podcasts\Pages\EditPodcast;
use App\Filament\Resources\Podcasts\Pages\ListPodcasts;
use App\Models\Podcast;
use App\Models\Speaker;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Livewire\Livewire;

beforeEach(function () {
    Storage::fake('public');
    $this->coverFails = false;

    Http::preventStrayRequests();
    Http::fake([
        'feed.ausha.co/*' => Http::response((string) file_get_contents(base_path('tests/Fixtures/ausha-feed.xml'))),
        'image.ausha.co/*' => fn () => $this->coverFails
            ? Http::response('', 503)
            : Http::response('cover', 200, ['Content-Type' => 'image/jpeg']),
    ]);
});

it('imports the episodes and extracts of the feed, without reruns or trailers', function () {
    $this->artisan('podcasts:sync')->assertSuccessful();

    expect(Podcast::pluck('ausha_guid')->all())->toEqualCanonicalizing(['guid-pedron', 'guid-guirriec', 'guid-extrait']);

    $podcast = Podcast::where('ausha_guid', 'guid-pedron')->firstOrFail();

    expect($podcast->title)->toBe("Jean Marie Pédron, cueilleur d'algues : celui qui donne le goût des algues")
        ->and($podcast->slug)->toBe('jean-marie-pedron-cueilleur-dalgues-celui-qui-donne-le-gout-des-algues')
        ->and($podcast->season)->toBe(3)
        ->and($podcast->number)->toBe(25)
        ->and($podcast->link)->toBe('https://podcast.ausha.co/la-recette/jean-marie-pedron')
        ->and($podcast->audio_url)->toBe('https://audio.ausha.co/pedron.mp3?t=1')
        ->and($podcast->duration)->toBe(53 * 60 + 18)
        ->and($podcast->published_at?->toDateString())->toBe('2026-09-28')
        ->and($podcast->summary)->toBe("Direction une ferme marine & ses algues.\n\nUn épisode enregistré les pieds dans l’eau.")
        ->and($podcast->image)->toBe('podcasts/ausha-guid-pedron.jpg');

    Storage::disk('public')->assertExists('podcasts/ausha-guid-pedron.jpg');

    expect(Podcast::where('ausha_guid', 'guid-guirriec')->firstOrFail())
        ->duration->toBe(3600 + 6 * 60 + 38)
        ->image->toBeNull();
});

it('keeps what was edited in the back office and only refreshes the listening data', function () {
    $this->artisan('podcasts:sync');

    $podcast = Podcast::where('ausha_guid', 'guid-pedron')->firstOrFail();
    $podcast->update(['title' => 'Le goût des algues', 'summary' => 'Résumé maison.', 'audio_url' => 'https://audio.ausha.co/ancien.mp3']);

    $this->artisan('podcasts:sync')->expectsOutputToContain('0 épisode(s) importé(s), 1 mis à jour');

    expect(Podcast::count())->toBe(3)
        ->and($podcast->fresh())
        ->title->toBe('Le goût des algues')
        ->summary->toBe('Résumé maison.')
        ->audio_url->toBe('https://audio.ausha.co/pedron.mp3?t=1');
});

it('attaches an episode added by hand to the feed through its link', function () {
    $podcast = Podcast::create([
        'title' => 'La pêche durable',
        'slug' => 'la-peche-durable',
        'link' => 'https://podcast.ausha.co/la-recette/la-peche-durable',
    ]);

    $this->artisan('podcasts:sync');

    expect(Podcast::count())->toBe(3)
        ->and($podcast->fresh())
        ->ausha_guid->toBe('guid-guirriec')
        ->title->toBe('La pêche durable')
        ->audio_url->toBe('https://audio.ausha.co/guirriec.mp3');
});

it('links a new episode to the intervenant named in its title, once', function () {
    $pedron = Speaker::create(['name' => 'Jean-Marie Pedron']);

    $this->artisan('podcasts:sync');

    $podcast = Podcast::where('ausha_guid', 'guid-pedron')->firstOrFail();

    expect($podcast->speaker_id)->toBe($pedron->id)
        ->and(Podcast::where('ausha_guid', 'guid-guirriec')->firstOrFail()->speaker_id)->toBeNull();

    // Removed in the back office: the next import leaves it alone.
    $podcast->update(['speaker_id' => null]);

    $this->artisan('podcasts:sync');

    expect($podcast->fresh()->speaker_id)->toBeNull();
});

it('keeps a hidden episode hidden and off the site', function () {
    $this->artisan('podcasts:sync');

    $podcast = Podcast::where('ausha_guid', 'guid-pedron')->firstOrFail();
    $podcast->update(['is_published' => false]);

    $this->artisan('podcasts:sync');

    expect(Podcast::count())->toBe(3)
        ->and($podcast->fresh()->is_published)->toBeFalse();

    $this->get(route('podcasts.index'))
        ->assertInertia(fn (Assert $page) => $page->has('podcasts', 2));
    $this->get(route('podcasts.show', $podcast))->assertNotFound();
});

it('tries again to download a cover that failed', function () {
    $this->coverFails = true;

    $this->artisan('podcasts:sync');

    $podcast = Podcast::where('ausha_guid', 'guid-pedron')->firstOrFail();

    expect($podcast->image)->toBeNull();

    $this->coverFails = false;
    $this->artisan('podcasts:sync');

    expect($podcast->fresh()->image)->toBe('podcasts/ausha-guid-pedron.jpg');
});

it('does not let an imported episode be deleted or its listening data edited', function () {
    $this->actingAs(User::factory()->admin()->create());
    $this->artisan('podcasts:sync');

    $imported = Podcast::where('ausha_guid', 'guid-pedron')->firstOrFail();
    $manual = Podcast::create(['title' => 'Hors-série', 'slug' => 'hors-serie', 'link' => 'https://example.com/hors-serie']);

    Livewire::test(EditPodcast::class, ['record' => $imported->getRouteKey()])
        ->assertActionHidden('delete')
        ->assertFormFieldDisabled('audio_url')
        ->assertFormFieldDisabled('link')
        ->fillForm(['is_published' => false])
        ->call('save')
        ->assertHasNoFormErrors();

    expect($imported->fresh())
        ->is_published->toBeFalse()
        ->audio_url->toBe('https://audio.ausha.co/pedron.mp3?t=1');

    Livewire::test(EditPodcast::class, ['record' => $manual->getRouteKey()])
        ->assertActionVisible('delete')
        ->assertFormFieldEnabled('audio_url');
});

it('synchronises from the back office', function () {
    $this->actingAs(User::factory()->admin()->create());

    Livewire::test(ListPodcasts::class)->callAction('sync')->assertNotified('Podcasts à jour');

    expect(Podcast::count())->toBe(3);
});

it('gives the audio file and the duration to the episode page', function () {
    $this->artisan('podcasts:sync');

    $podcast = Podcast::where('ausha_guid', 'guid-pedron')->firstOrFail();

    $this->get(route('podcasts.show', $podcast))
        ->assertInertia(fn (Assert $page) => $page
            ->component('podcasts/show')
            ->where('podcast.audio_url', 'https://audio.ausha.co/pedron.mp3?t=1')
            ->where('podcast.duration', 3198)
            ->where('podcast.image_url', Storage::disk('public')->url('podcasts/ausha-guid-pedron.jpg')));
});
