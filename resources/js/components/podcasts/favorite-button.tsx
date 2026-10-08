import { router } from '@inertiajs/react';
import { BookmarkIcon, HeartIcon } from '@/components/icons';
import { favorite } from '@/routes/podcasts';
import type { Podcast } from '@/types';

type Props = {
    podcast: Podcast;
    /** Affiche le libellé à côté de l'icône (page d'un épisode). */
    withLabel?: boolean;
    /** Cœur à côté du titre (espace compte) au lieu du marque-page sur le visuel. */
    icon?: 'bookmark' | 'heart';
};

/** Marque-page « à écouter plus tard » ; sans compte, passe par la connexion. */
export default function FavoriteButton({
    podcast,
    withLabel = false,
    icon = 'bookmark',
}: Props) {
    const Icon = icon === 'heart' ? HeartIcon : BookmarkIcon;
    const label = podcast.is_favorite
        ? 'Retirer de mes écoutes'
        : 'À écouter plus tard';

    // Sans compte, le serveur renvoie vers la connexion et retient l'épisode.
    function toggle() {
        router.post(
            favorite.url(podcast),
            {},
            { preserveScroll: true, preserveState: true },
        );
    }

    return (
        <button
            type="button"
            className={`favorite-button${withLabel ? ' favorite-button--label' : ''}${icon === 'heart' ? ' favorite-button--heart' : ''}`}
            aria-pressed={podcast.is_favorite}
            aria-label={withLabel ? undefined : label}
            title={withLabel ? undefined : label}
            onClick={toggle}
        >
            <Icon filled={podcast.is_favorite} />
            {withLabel && label}
        </button>
    );
}
