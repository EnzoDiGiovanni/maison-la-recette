import { Head, Link } from '@inertiajs/react';
import FavoriteButton from '@/components/podcasts/favorite-button';
import ProseText from '@/components/prose-text';
import SiteLayout from '@/layouts/site-layout';
import { formatDate, formatDuration } from '@/lib/format';
import { index } from '@/routes/podcasts';
import type { Podcast } from '@/types';

type Props = {
    podcast: Podcast;
};

export default function PodcastsShow({ podcast }: Props) {
    return (
        <SiteLayout>
            <Head title={podcast.title} />

            <Link href={index.url()}>Tous les épisodes</Link>

            <article>
                <h1>{podcast.title}</h1>
                <p>
                    {[
                        podcast.season !== null && `Saison ${podcast.season}`,
                        podcast.number !== null && `Épisode ${podcast.number}`,
                        podcast.duration !== null &&
                            formatDuration(podcast.duration),
                    ]
                        .filter(Boolean)
                        .join(' · ')}
                </p>
                {podcast.published_at && (
                    <time dateTime={podcast.published_at}>
                        {formatDate(podcast.published_at)}
                    </time>
                )}

                {podcast.image_url && <img src={podcast.image_url} alt="" />}

                {/* Les épisodes importés d'Ausha ont leur fichier audio ; les
                    autres gardent le lecteur collé dans le back-office. */}
                {podcast.audio_url ? (
                    <audio controls preload="none" src={podcast.audio_url} />
                ) : (
                    podcast.iframe && (
                        <div
                            dangerouslySetInnerHTML={{ __html: podcast.iframe }}
                        />
                    )
                )}

                <a href={podcast.link}>Écouter sur les plateformes</a>

                <FavoriteButton podcast={podcast} withLabel />

                <ProseText text={podcast.summary} />
            </article>
        </SiteLayout>
    );
}
