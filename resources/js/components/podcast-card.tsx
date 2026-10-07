import { Link } from '@inertiajs/react';
import { formatDate } from '@/lib/format';
import { show } from '@/routes/podcasts';
import type { Podcast } from '@/types';

type Props = {
    podcast: Podcast;
    /** Version page d'accueil : visuel, titre, citation et intervenant·e. */
    compact?: boolean;
};

export default function PodcastCard({ podcast, compact = false }: Props) {
    return (
        <li>
            {podcast.image_url && <img src={podcast.image_url} alt="" />}
            <Link href={show.url(podcast)}>
                {!compact && podcast.number !== null && `#${podcast.number} `}
                {podcast.title}
            </Link>
            {compact && podcast.quote && (
                <blockquote>{podcast.quote}</blockquote>
            )}
            {podcast.speaker && <p>{podcast.speaker.name}</p>}
            {!compact && podcast.published_at && (
                <time dateTime={podcast.published_at}>
                    {formatDate(podcast.published_at)}
                </time>
            )}
        </li>
    );
}
