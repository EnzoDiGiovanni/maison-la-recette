<?php

namespace App\Services\Ausha;

use Illuminate\Support\Carbon;

/**
 * One episode as read from the Ausha RSS feed.
 */
final readonly class AushaEpisode
{
    public function __construct(
        public string $guid,
        public string $title,
        public string $link,
        public ?string $audioUrl,
        public ?string $imageUrl,
        public ?string $summary,
        public ?int $season,
        public ?int $number,
        public ?int $duration,
        public ?Carbon $publishedAt,
    ) {}
}
