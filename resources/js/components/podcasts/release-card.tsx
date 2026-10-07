import { Link } from '@inertiajs/react';
import Cover from '@/components/podcasts/cover';
import { podcastGuest, podcastSubject, podcastTeaser } from '@/lib/podcast';
import { show } from '@/routes/podcasts';
import type { Podcast } from '@/types';

type Props = {
    podcast: Podcast;
    /** Couleur de la carte : jaune ou saumon, en damier. */
    tone: 'jaune' | 'saumon';
};

/** Grande carte d'épisode : visuel, citation, titre, accroche, invité·e. */
export default function ReleaseCard({ podcast, tone }: Props) {
    const guest = podcastGuest(podcast);
    const teaser = podcastTeaser(podcast);

    return (
        <li className={`release-card release-card--${tone}`}>
            <Link href={show.url(podcast)}>
                <Cover
                    src={podcast.image_url}
                    className="release-card__photo"
                />
                <div className="release-card__body">
                    {podcast.quote && (
                        <blockquote className="release-card__quote">
                            “&nbsp;{podcast.quote}”
                        </blockquote>
                    )}
                    <strong className="release-card__title">
                        {podcastSubject(podcast)}
                    </strong>
                    {teaser && <p className="release-card__teaser">{teaser}</p>}
                </div>
                {guest && (
                    <span className="release-card__guest">Avec {guest}</span>
                )}
            </Link>
        </li>
    );
}
