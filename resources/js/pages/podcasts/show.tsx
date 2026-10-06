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

                {podcast.image_url && <img src={podcast.image_url} alt="" />}

                {/* Lecteur collé dans le back-office par l'administratrice. */}
                {podcast.iframe && (
                    <div dangerouslySetInnerHTML={{ __html: podcast.iframe }} />
                )}

                <a href={podcast.link}>Écouter sur les plateformes</a>

                {podcast.summary &&
                    podcast.summary
                        .split(/\n{2,}/)
                        .map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

                {podcast.quote && (
                    <figure>
                        <blockquote>{podcast.quote}</blockquote>
                        {podcast.speaker && (
                            <figcaption>{podcast.speaker.name}</figcaption>
                        )}
                    </figure>
                )}

                {podcast.speaker && (
                    <section>
                        <h2>L'intervenant·e</h2>
                        {podcast.speaker.photo_url && (
                            <img src={podcast.speaker.photo_url} alt="" />
                        )}
                        <p>{podcast.speaker.name}</p>
                        {podcast.speaker.role && <p>{podcast.speaker.role}</p>}
                        {podcast.speaker.bio && <p>{podcast.speaker.bio}</p>}
                    </section>
                )}
            </article>
        </SiteLayout>
    );
}
