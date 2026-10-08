import type { Podcast } from '@/types';
import type { Settings } from '@/types/models';

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

/** Plateformes d'écoute de l'émission, dans l'ordre d'affichage (Réglages du back-office). */
const LISTENING_PLATFORMS = [
    { label: 'Apple Podcasts', key: 'link_apple_podcasts' },
    { label: 'Overcast', key: 'link_overcast' },
    { label: 'Podcast Addict', key: 'link_podcast_addict' },
    { label: 'Spotify', key: 'link_spotify' },
    { label: 'Deezer', key: 'link_deezer' },
    { label: 'Amazon Music', key: 'link_amazon_music' },
    { label: 'Castbox', key: 'link_castbox' },
    { label: 'Castro', key: 'link_castro' },
    { label: 'Pocket Casts', key: 'link_pocket_casts' },
] as const;

export type ListeningPlatformKey = (typeof LISTENING_PLATFORMS)[number]['key'];

/** Les plateformes dont le lien est renseigné. */
export function listeningPlatforms(settings: Settings) {
    return LISTENING_PLATFORMS.map((platform) => ({
        ...platform,
        url: settings[platform.key],
    })).filter((platform) => platform.url);
}
