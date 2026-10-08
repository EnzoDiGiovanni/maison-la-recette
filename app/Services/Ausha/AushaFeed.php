<?php

namespace App\Services\Ausha;

use Carbon\Exceptions\InvalidFormatException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use SimpleXMLElement;

/**
 * Reads the public RSS feed of the show hosted on Ausha.
 */
class AushaFeed
{
    private const string ITUNES = 'http://www.itunes.com/dtds/podcast-1.0.dtd';

    /**
     * The feed also carries teasers and reruns, published as regular
     * episodes: their title is the only way to tell them apart.
     */
    private const string SIDE_CONTENT = '/^\W*(teaser|replay|rediffusion)\b/iu';

    /**
     * Extracts are kept, whatever their type: the site lists them apart.
     */
    private const string EXTRACT = '/extrait/iu';

    /**
     * Every description ends with the same credits and social links: the
     * summary stops at the first paragraph starting like one of these.
     */
    private const string FOOTER = '/^\W*(production, réalisation|musique :|pour soutenir ce podcast|envie de (changer|nous suivre|collaborer)|hébergé par ausha)/iu';

    /**
     * The main episodes of the show and their extracts, most recent first.
     *
     * @return list<AushaEpisode>
     */
    public function episodes(): array
    {
        try {
            $response = Http::timeout(30)->get((string) config('services.ausha.feed_url'));
        } catch (ConnectionException) {
            throw new RuntimeException('Le flux Ausha est injoignable.');
        }

        if ($response->failed()) {
            throw new RuntimeException("Le flux Ausha a répondu avec le code {$response->status()}.");
        }

        $xml = @simplexml_load_string($response->body(), options: LIBXML_NOCDATA);

        if ($xml === false || ! isset($xml->channel)) {
            throw new RuntimeException('Le flux Ausha est illisible.');
        }

        $episodes = [];

        foreach ($xml->channel->item as $item) {
            $episode = $this->episode($item);

            if ($episode !== null) {
                $episodes[] = $episode;
            }
        }

        return $episodes;
    }

    private function episode(SimpleXMLElement $item): ?AushaEpisode
    {
        $itunes = $item->children(self::ITUNES);
        $guid = trim((string) $item->guid);
        $title = trim((string) $item->title);
        $type = trim((string) $itunes->episodeType);

        if ($guid === '' || $title === '' || $type === 'trailer') {
            return null;
        }

        if (preg_match(self::EXTRACT, $title) !== 1 && ($type === 'bonus' || preg_match(self::SIDE_CONTENT, $title) === 1)) {
            return null;
        }

        return new AushaEpisode(
            guid: $guid,
            title: mb_substr($title, 0, 255),
            link: trim((string) $item->link) ?: (string) config('services.ausha.feed_url'),
            audioUrl: $this->nullable((string) ($item->enclosure['url'] ?? '')),
            imageUrl: $this->nullable((string) ($itunes->image?->attributes()['href'] ?? '')),
            summary: $this->summary((string) $item->description),
            season: $this->integer((string) $itunes->season),
            number: $this->integer((string) $itunes->episode),
            duration: $this->seconds((string) $itunes->duration),
            publishedAt: $this->date((string) $item->pubDate),
        );
    }

    /**
     * Turns the HTML description into paragraphs separated by blank lines,
     * without the credits repeated under every episode.
     */
    private function summary(string $html): ?string
    {
        $text = (string) preg_replace('/<br\s*\/?>/i', "\n", $html);
        $text = (string) preg_replace('/<\/(p|div|li|h[1-6])>/i', "\n\n", $text);
        $text = html_entity_decode(strip_tags($text), ENT_QUOTES | ENT_HTML5);

        $paragraphs = [];

        foreach (preg_split('/\n\s*\n/u', $text) ?: [] as $paragraph) {
            $paragraph = trim((string) preg_replace('/[^\S\n]+/u', ' ', $paragraph));

            if ($paragraph === '') {
                continue;
            }

            if (preg_match(self::FOOTER, $paragraph) === 1) {
                break;
            }

            $paragraphs[] = $paragraph;
        }

        return $paragraphs === [] ? null : implode("\n\n", $paragraphs);
    }

    /**
     * Ausha writes durations as « 06:48 » or « 1:07:15 ».
     */
    private function seconds(string $duration): ?int
    {
        $duration = trim($duration);

        if (preg_match('/^\d+(:\d{1,2}){0,2}$/', $duration) !== 1) {
            return null;
        }

        $seconds = 0;

        foreach (explode(':', $duration) as $part) {
            $seconds = $seconds * 60 + (int) $part;
        }

        return $seconds;
    }

    /**
     * One unreadable date must not stop the whole import.
     */
    private function date(string $value): ?Carbon
    {
        try {
            return trim($value) === '' ? null : Carbon::parse($value)->setTimezone((string) config('app.timezone'));
        } catch (InvalidFormatException) {
            return null;
        }
    }

    private function integer(string $value): ?int
    {
        return ctype_digit(trim($value)) ? (int) trim($value) : null;
    }

    private function nullable(string $value): ?string
    {
        return trim($value) === '' ? null : trim($value);
    }
}
