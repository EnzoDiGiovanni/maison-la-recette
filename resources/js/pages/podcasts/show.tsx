import { Head, Link } from '@inertiajs/react';
import ProseText from '@/components/prose-text';
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

                {podcast.image_url && <img src={podcast.image_url} alt="" />}

                {/* Lecteur collé dans le back-office par l'administratrice. */}
                {podcast.iframe && (
                    <div dangerouslySetInnerHTML={{ __html: podcast.iframe }} />
                )}

                <a href={podcast.link}>Écouter sur les plateformes</a>

                <ProseText text={podcast.summary} />
            </article>
        </SiteLayout>
    );
}
