import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowDownRightIcon } from '@/components/icons';
import Cover from '@/components/podcasts/cover';
import FavoriteButton from '@/components/podcasts/favorite-button';
import PodcastTile from '@/components/podcasts/podcast-tile';
import ProseText from '@/components/prose-text';
import SectionTitle from '@/components/section-title';
import SiteLayout from '@/layouts/site-layout';
import { formatDate, formatDuration } from '@/lib/format';
import {
    extractTitle,
    isExtract,
    listeningPlatforms,
    podcastGuest,
    podcastSubject,
} from '@/lib/podcast';
import { index } from '@/routes/podcasts';
import type { Podcast } from '@/types';

type Props = {
    podcast: Podcast;
    /** Autres épisodes publiés, les plus récents d'abord. */
    otherPodcasts: Podcast[];
};

export default function PodcastsShow({ podcast, otherPodcasts }: Props) {
    const { settings } = usePage().props;
    const { speaker } = podcast;
    const extract = isExtract(podcast);
    const guest = podcastGuest(podcast);

    const meta = [
        extract && 'Extrait',
        podcast.season !== null && `Saison ${podcast.season}`,
        podcast.number !== null && `Épisode ${podcast.number}`,
        podcast.duration !== null && formatDuration(podcast.duration),
    ].filter(Boolean);

    // Le premier lien mène à l'épisode, les autres à l'émission.
    const platforms = [
        { label: 'Ausha', url: podcast.link },
        ...listeningPlatforms(settings),
    ].filter((platform) => platform.url);

    return (
        <SiteLayout title="Podcast">
            <Head title={podcast.title} />

            <div className="podcast-show">
                <Link href={index.url()} className="podcast-show__back">
                    <ArrowDownRightIcon />
                    Tous les épisodes
                </Link>

                <article>
                    <header className="podcast-show__hero">
                        <Cover
                            src={podcast.image_url}
                            className="podcast-show__cover"
                        />

                        <div className="podcast-show__intro">
                            <p className="podcast-show__meta">
                                <span>{meta.join(' · ')}</span>
                                {podcast.published_at && (
                                    <time dateTime={podcast.published_at}>
                                        {formatDate(podcast.published_at)}
                                    </time>
                                )}
                            </p>

                            <h1 className="podcast-show__title">
                                {extract
                                    ? extractTitle(podcast)
                                    : podcastSubject(podcast)}
                            </h1>

                            {guest && (
                                <p className="podcast-show__guest">
                                    Avec {guest}
                                </p>
                            )}

                            {/* Les épisodes importés d'Ausha ont leur fichier audio ; les
                                autres gardent le lecteur collé dans le back-office. */}
                            {podcast.audio_url ? (
                                <audio
                                    className="podcast-show__player"
                                    controls
                                    preload="none"
                                    src={podcast.audio_url}
                                />
                            ) : (
                                podcast.iframe && (
                                    <div
                                        className="podcast-show__embed"
                                        dangerouslySetInnerHTML={{
                                            __html: podcast.iframe,
                                        }}
                                    />
                                )
                            )}

                            <FavoriteButton podcast={podcast} withLabel />
                        </div>
                    </header>

                    <div className="podcast-show__body">
                        <div className="podcast-show__summary">
                            <h2 className="podcast-show__heading">
                                {extract ? "L'extrait" : "L'épisode"}
                            </h2>
                            <ProseText text={podcast.summary} />
                        </div>

                        <aside className="podcast-show__aside">
                            {podcast.quote && (
                                <blockquote className="podcast-show__quote">
                                    “&nbsp;{podcast.quote}&nbsp;”
                                    {guest && <cite>{guest}</cite>}
                                </blockquote>
                            )}

                            {speaker && (
                                <div className="podcast-show__speaker">
                                    <Cover
                                        src={speaker.photo_url}
                                        className="podcast-show__speaker-photo"
                                    />
                                    <div>
                                        <strong>{speaker.name}</strong>
                                        {speaker.role && <p>{speaker.role}</p>}
                                    </div>
                                    {speaker.bio && (
                                        <p className="podcast-show__speaker-bio">
                                            {speaker.bio}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="podcast-show__platforms">
                                <h2 className="podcast-show__heading">
                                    Écouter ailleurs
                                </h2>
                                <ul>
                                    {platforms.map((platform) => (
                                        <li key={platform.label}>
                                            <a
                                                href={platform.url ?? undefined}
                                                className="btn btn--ghost"
                                            >
                                                {platform.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>
                    </div>
                </article>

                {otherPodcasts.length > 0 && (
                    <section>
                        <SectionTitle>À écouter aussi</SectionTitle>
                        <ul className="podcast-row">
                            {otherPodcasts.map((other) => (
                                <PodcastTile key={other.id} podcast={other} />
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </SiteLayout>
    );
}
