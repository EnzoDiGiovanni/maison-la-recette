import { Head, Link } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import { formatDate } from '@/lib/format';
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
                    {podcast.season !== null && `Saison ${podcast.season}`}
                    {podcast.number !== null && ` · Épisode ${podcast.number}`}
                </p>
                {podcast.published_at && (
                    <time dateTime={podcast.published_at}>
                        {formatDate(podcast.published_at)}
                    </time>
                )}

                {/* Lecteur collé dans le back-office par l'administratrice. */}
                {podcast.iframe && (
                    <div dangerouslySetInnerHTML={{ __html: podcast.iframe }} />
                )}

                <a href={podcast.link}>Écouter sur les plateformes</a>

                {podcast.summary &&
                    podcast.summary
                        .split(/\n{2,}/)
                        .map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </article>
        </SiteLayout>
    );
}
