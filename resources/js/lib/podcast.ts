import type { Podcast } from '@/types';

/**
 * Les titres d'épisodes suivent le format « Invité — Sujet »
 * (ex. « Jean-Marie Pedron — Les Jardins de la Mer »).
 */
export function podcastGuest(podcast: Podcast): string | null {
    if (podcast.speaker) {
        return podcast.speaker.name;
    }

    return podcast.title.includes('—')
        ? podcast.title.split('—')[0].trim()
        : null;
}

export function podcastSubject(podcast: Podcast): string {
    const [, subject] = podcast.title.split('—');

    return subject?.trim() ?? podcast.title;
}

/** Accroche de l'épisode : premier paragraphe du résumé. */
export function podcastTeaser(podcast: Podcast): string | null {
    return podcast.summary?.split(/\n{2,}/)[0] ?? null;
}

const EXTRACT_PREFIX =
    /^(?:REPLAY\s*-\s*)?(?:\[\s*EXTRAIT[^\]]*\]|EXTRAIT\s*\d*)\s*-?\s*/i;

/** Les extraits d'épisodes portent « EXTRAIT » dans leur titre. */
export function isExtract(podcast: Podcast): boolean {
    return /extrait/i.test(podcast.title);
}

/** Titre d'un extrait sans son préfixe « [EXTRAIT 1 - Invité] - ». */
export function extractTitle(podcast: Podcast): string {
    return podcast.title.replace(EXTRACT_PREFIX, '').trim() || podcast.title;
}
