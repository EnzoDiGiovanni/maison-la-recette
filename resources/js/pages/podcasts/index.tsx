import { Head } from '@inertiajs/react';
import PlatformLinks from '@/components/platform-links';
import PodcastCard from '@/components/podcast-card';
import PodcastStats from '@/components/podcast-stats';
import SiteLayout from '@/layouts/site-layout';
import type { Podcast } from '@/types';

type Props = {
    podcasts: Podcast[];
};

export default function PodcastsIndex({ podcasts }: Props) {
    const seasons = [...new Set(podcasts.map((podcast) => podcast.season))];

    return (
        <SiteLayout>
            <Head title="Podcast" />

            <h1>Le podcast La recette</h1>
            <p>
                La recette donne la parole à des producteur·ices, chef·fes,
                artisan·es ou entrepreneur·ses engagé·es.
            </p>

            <PodcastStats />

            <PlatformLinks />

            {seasons.map((season) => (
                <section key={season ?? 'hors-saison'}>
                    <h2>
                        {season === null ? 'Hors saison' : `Saison ${season}`}
                    </h2>
                    <ul>
                        {podcasts
                            .filter((podcast) => podcast.season === season)
                            .map((podcast) => (
                                <li key={podcast.id}>
                                    {podcast.image_url && (
                                        <img src={podcast.image_url} alt="" />
                                    )}
                                    <Link href={show.url(podcast)}>
                                        {podcast.number !== null &&
                                            `#${podcast.number} `}
                                        {podcast.title}
                                    </Link>
                                    {podcast.speaker && (
                                        <p>
                                            {podcast.speaker.name}
                                            {podcast.speaker.role &&
                                                `, ${podcast.speaker.role}`}
                                        </p>
                                    )}
                                    {podcast.published_at && (
                                        <time dateTime={podcast.published_at}>
                                            {formatDate(podcast.published_at)}
                                        </time>
                                    )}
                                </li>
                            ))}
                    </ul>
                </section>
            ))}
        </SiteLayout>
    );
}
