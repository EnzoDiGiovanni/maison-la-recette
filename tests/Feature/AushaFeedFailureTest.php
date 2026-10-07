<?php

use App\Models\Podcast;
use Illuminate\Support\Facades\Http;

it('fails without touching the episodes when the feed is unavailable', function () {
    Http::fake(['feed.ausha.co/*' => Http::response('', 503)]);

    $this->artisan('podcasts:sync')->expectsOutputToContain('503')->assertFailed();

    expect(Podcast::count())->toBe(0);
});

it('fails when the feed is not a podcast feed', function () {
    Http::fake(['feed.ausha.co/*' => Http::response('<html>Maintenance</html>')]);

    $this->artisan('podcasts:sync')->assertFailed();

    expect(Podcast::count())->toBe(0);
});

it('imports an episode whose date is unreadable', function () {
    Http::fake(['feed.ausha.co/*' => Http::response(<<<'XML'
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0"><channel><item>
            <title>Un épisode sans date lisible</title>
            <guid>guid-date</guid>
            <pubDate>bientôt</pubDate>
            <link>https://podcast.ausha.co/la-recette/sans-date</link>
        </item></channel></rss>
        XML)]);

    $this->artisan('podcasts:sync')->assertSuccessful();

    expect(Podcast::where('ausha_guid', 'guid-date')->firstOrFail()->published_at)->toBeNull();
});
