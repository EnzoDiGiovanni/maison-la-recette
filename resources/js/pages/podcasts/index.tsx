import { Head } from '@inertiajs/react';
import { useState } from 'react';
import GuestCard from '@/components/podcasts/guest-card';
import PodcastCta from '@/components/podcasts/podcast-cta';
import PodcastSlider from '@/components/podcasts/podcast-slider';
import PodcastTile from '@/components/podcasts/podcast-tile';
import ReleaseCard from '@/components/podcasts/release-card';
import SectionTitle from '@/components/section-title';
import useReveal from '@/hooks/use-reveal';
import SiteLayout from '@/layouts/site-layout';
import { isExtract, podcastGuest } from '@/lib/podcast';
import type { Podcast } from '@/types';

type Props = {
    podcasts: Podcast[];
};

/** Épisodes affichés d'emblée, puis ajoutés à chaque « Charger plus ». */
const PAGE_SIZE = 10;

/** Damier des grandes cartes : jaune/saumon puis saumon/jaune. */
function tone(position: number): 'jaune' | 'saumon' {
    return (position + Math.floor(position / 2)) % 2 === 0 ? 'jaune' : 'saumon';
}

type Guest = { name: string; photoUrl: string | null; podcast: Podcast };

export default function PodcastsIndex({ podcasts }: Props) {
    const [visible, setVisible] = useState(PAGE_SIZE);
    useReveal();

    // Les épisodes arrivent du plus récent au plus ancien.
    const extracts = podcasts.filter(isExtract);
    const episodes = podcasts.filter((podcast) => !isExtract(podcast));

    // Épisodes marqués « à la une » dans le back-office.
    const featured = episodes
        .filter((podcast) => podcast.is_featured)
        .slice(0, 5);

    // Sorties du mois : le mois en cours ou, s'il n'a encore aucun épisode,
    // le dernier mois qui en compte (AAAA-MM, les épisodes sont déjà triés).
    const latestMonth = episodes
        .find((podcast) => podcast.published_at)
        ?.published_at?.slice(0, 7);
    const monthReleases = episodes.filter(
        (podcast) =>
            latestMonth !== undefined &&
            podcast.published_at?.startsWith(latestMonth),
    );
    const month = latestMonth
        ? new Intl.DateTimeFormat('fr-FR', {
              month: 'long',
              timeZone: 'UTC',
          }).format(new Date(`${latestMonth}-01T00:00:00Z`))
        : '';

    // Intervenant·es sans doublons, dans l'ordre des épisodes.
    const guests = [
        ...new Map(
            episodes.flatMap((podcast): [string, Guest][] => {
                const name = podcastGuest(podcast);

                return name
                    ? [
                          [
                              name,
                              {
                                  name,
                                  photoUrl: podcast.speaker?.photo_url ?? null,
                                  podcast,
                              },
                          ],
                      ]
                    : [];
            }),
        ).values(),
    ];

    return (
        <SiteLayout title="Podcast">
            <Head title="Podcast" />

            <div className="podcast-page">
                <h1 className="sr-only">Le podcast La recette</h1>

                {featured.length > 0 && (
                    <section className="reveal">
                        <SectionTitle>Podcasts à la une</SectionTitle>
                        <ul className="podcast-row">
                            {featured.map((podcast) => (
                                <PodcastTile
                                    key={podcast.id}
                                    podcast={podcast}
                                />
                            ))}
                        </ul>
                    </section>
                )}

                <div className="reveal">
                    <PodcastCta />
                </div>

                {monthReleases.length > 0 && (
                    <section className="reveal">
                        <SectionTitle>
                            {/* « d'octobre », « de septembre ». */}
                            Les podcasts{' '}
                            {/^[aeiouéèh]/i.test(month) ? "d'" : 'de '}
                            {month}
                        </SectionTitle>
                        <ul className="release-grid">
                            {monthReleases.map((podcast, position) => (
                                <ReleaseCard
                                    key={podcast.id}
                                    podcast={podcast}
                                    tone={tone(position)}
                                />
                            ))}
                        </ul>
                    </section>
                )}

                {extracts.length > 0 && (
                    <section className="reveal">
                        <SectionTitle>Les extraits</SectionTitle>
                        <PodcastSlider label="extraits">
                            {extracts.map((podcast) => (
                                <PodcastTile
                                    key={podcast.id}
                                    podcast={podcast}
                                />
                            ))}
                        </PodcastSlider>
                    </section>
                )}

                <section className="reveal">
                    <SectionTitle>Tous les podcasts</SectionTitle>
                    <ul className="podcast-row podcast-row--wrap">
                        {episodes.slice(0, visible).map((podcast) => (
                            <PodcastTile key={podcast.id} podcast={podcast} />
                        ))}
                    </ul>
                    {visible < episodes.length && (
                        <button
                            type="button"
                            className="load-more"
                            onClick={() => setVisible(visible + PAGE_SIZE)}
                        >
                            Charger 10 de plus
                        </button>
                    )}
                </section>

                {guests.length > 0 && (
                    <section className="reveal">
                        <SectionTitle>Les intervenants</SectionTitle>
                        <PodcastSlider label="intervenants">
                            {guests.map((guest) => (
                                <GuestCard key={guest.name} {...guest} />
                            ))}
                        </PodcastSlider>
                    </section>
                )}
            </div>
        </SiteLayout>
    );
}
