import { Link } from '@inertiajs/react';
import Cover from '@/components/podcasts/cover';
import FavoriteButton from '@/components/podcasts/favorite-button';
import {
    extractTitle,
    isExtract,
    podcastGuest,
    podcastTeaser,
} from '@/lib/podcast';
import { show } from '@/routes/podcasts';
import type { Podcast } from '@/types';

/** Petite carte d'épisode : visuel, accroche, invité·e. */
export default function PodcastTile({ podcast }: { podcast: Podcast }) {
    const guest = podcastGuest(podcast);

    return (
        <li className="podcast-tile">
            <Link href={show.url(podcast)}>
                <Cover
                    src={podcast.image_url}
                    className="podcast-tile__photo"
                />
                <span className="podcast-tile__title">
                    {/* Un extrait se résume à la question posée dans son titre. */}
                    {isExtract(podcast)
                        ? extractTitle(podcast)
                        : (podcastTeaser(podcast) ?? podcast.title)}
                </span>
                {guest && <span className="podcast-tile__guest">{guest}</span>}
            </Link>
            <FavoriteButton podcast={podcast} />
        </li>
    );
}
