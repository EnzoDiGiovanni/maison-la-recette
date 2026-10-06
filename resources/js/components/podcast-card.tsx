import { Link } from '@inertiajs/react';
import { formatDate } from '@/lib/format';
import { show } from '@/routes/podcasts';
import type { Podcast } from '@/types';

type Props = {
    podcast: Podcast;
    /** Version raccourcie pour la page d'accueil : titre uniquement. */
    compact?: boolean;
};

export default function PodcastCard({ podcast, compact = false }: Props) {
    return (
        <li>
            <Link href={show.url(podcast)}>
                {!compact && podcast.number !== null && `#${podcast.number} `}
                {podcast.title}
            </Link>
            {!compact && podcast.published_at && (
                <time dateTime={podcast.published_at}>
                    {formatDate(podcast.published_at)}
                </time>
            )}
        </li>
    );
}
