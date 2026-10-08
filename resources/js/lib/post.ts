import type { Post } from '@/types';

export type PostTone = 'vert' | 'jaune' | 'bleu' | 'rouge';

const TONES: PostTone[] = ['vert', 'jaune', 'bleu', 'rouge'];

/** Couleur du visuel d'un article sans photo, selon sa place dans la liste. */
export function postTone(position: number): PostTone {
    return TONES[position % TONES.length];
}

/** Temps de lecture estimé à 200 mots par minute : « 3 min de lecture ». */
export function readingTime(post: Post): string {
    const words = post.body
        .replace(/<[^>]+>/g, ' ')
        .split(/\s+/)
        .filter(Boolean).length;

    return `${Math.max(1, Math.round(words / 200))} min de lecture`;
}
