import { Head, Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import { formatDate } from '@/lib/format';
import { show } from '@/routes/podcasts';
import type { Podcast } from '@/types';

type Props = {
    podcasts: Podcast[];
};

export default function PodcastsIndex({ podcasts }: Props) {
    const { settings } = usePage().props;

    const seasons = [...new Set(podcasts.map((podcast) => podcast.season))];

    const stats = [
        { label: 'Note moyenne', value: settings.podcast_rating },
        { label: 'Avis', value: settings.podcast_reviews_count },
        { label: "Taux d'écoute moyen", value: settings.podcast_listen_rate },
        { label: 'Écoutes', value: settings.podcast_total_listens },
        { label: 'Épisodes', value: settings.podcast_episodes_count },
    ].filter((stat) => stat.value);

    const platforms = [
        { label: 'Ausha', url: settings.link_ausha },
        { label: 'Spotify', url: settings.link_spotify },
        { label: 'Apple Podcasts', url: settings.link_apple_podcasts },
        { label: 'Deezer', url: settings.link_deezer },
        { label: 'YouTube', url: settings.link_youtube },
    ].filter((platform) => platform.url);

    return (
        <SiteLayout>
            <Head title="Podcast" />

            <h1>Le podcast La recette</h1>
            <p>
                La recette donne la parole à des producteur·ices, chef·fes,
                artisan·es ou entrepreneur·ses engagé·es.
            </p>

            <dl>
                {stats.map((stat) => (
                    <div key={stat.label}>
                        <dt>{stat.label}</dt>
                        <dd>{stat.value}</dd>
                    </div>
                ))}
            </dl>

            <ul>
                {platforms.map((platform) => (
                    <li key={platform.label}>
                        <a href={platform.url ?? undefined}>{platform.label}</a>
                    </li>
                ))}
            </ul>

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
                                    <Link href={show.url(podcast)}>
                                        {podcast.number !== null &&
                                            `#${podcast.number} `}
                                        {podcast.title}
                                    </Link>
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
