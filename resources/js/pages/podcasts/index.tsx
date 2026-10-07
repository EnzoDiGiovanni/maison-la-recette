import { Head } from '@inertiajs/react';
import { useRef } from 'react';
import { ChevronRightIcon } from '@/components/icons';
import GuestCard from '@/components/podcasts/guest-card';
import PodcastCta from '@/components/podcasts/podcast-cta';
import PodcastTile from '@/components/podcasts/podcast-tile';
import ReleaseCard from '@/components/podcasts/release-card';
import SectionTitle from '@/components/section-title';
import useReveal from '@/hooks/use-reveal';
import SiteLayout from '@/layouts/site-layout';
import { podcastGuest } from '@/lib/podcast';
import type { Podcast } from '@/types';

type Props = {
    podcasts: Podcast[];
};

type Guest = { name: string; photoUrl: string | null; podcast: Podcast };

export default function PodcastsIndex({ podcasts }: Props) {
    const guestsRef = useRef<HTMLUListElement>(null);
    useReveal();

    // Les plus écoutés : les épisodes mis en avant, complétés par les récents.
    const mostListened = [...podcasts]
        .sort((a, b) => Number(b.is_featured) - Number(a.is_featured))
        .slice(0, 5);

    // Sorties du mois courant, ou les dernières parutions s'il n'y en a pas.
    const now = new Date();
    const month = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(
        now,
    );
    const monthReleases = podcasts.filter((podcast) => {
        if (!podcast.published_at) {
            return false;
        }
        const publishedAt = new Date(`${podcast.published_at}T00:00:00Z`);

        return (
            publishedAt.getUTCFullYear() === now.getUTCFullYear() &&
            publishedAt.getUTCMonth() === now.getUTCMonth()
        );
    });
    const releases = (
        monthReleases.length > 0 ? monthReleases : podcasts
    ).slice(0, 4);

    // Intervenant·es sans doublons, dans l'ordre des épisodes.
    const guests = [
        ...new Map(
            podcasts.flatMap((podcast): [string, Guest][] => {
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

                <section className="reveal">
                    <SectionTitle>Les plus écoutés</SectionTitle>
                    <ul className="podcast-row">
                        {mostListened.map((podcast) => (
                            <PodcastTile key={podcast.id} podcast={podcast} />
                        ))}
                    </ul>
                </section>

                <div className="reveal">
                    <PodcastCta />
                </div>

                <section className="reveal">
                    <SectionTitle>
                        {monthReleases.length > 0 ? (
                            <>
                                Les sorties de{' '}
                                <span className="section-title__accent">
                                    “{month}”
                                </span>
                            </>
                        ) : (
                            'Les dernières sorties'
                        )}
                    </SectionTitle>
                    <ul className="release-grid">
                        {releases.map((podcast, position) => (
                            <ReleaseCard
                                key={podcast.id}
                                podcast={podcast}
                                // Damier : jaune/saumon puis saumon/jaune.
                                tone={
                                    (position + Math.floor(position / 2)) %
                                        2 ===
                                    0
                                        ? 'jaune'
                                        : 'saumon'
                                }
                            />
                        ))}
                    </ul>
                </section>

                <section className="reveal">
                    <SectionTitle>Les intervenants</SectionTitle>
                    <div className="guests">
                        <ul className="podcast-row" ref={guestsRef}>
                            {guests.map((guest) => (
                                <GuestCard key={guest.name} {...guest} />
                            ))}
                        </ul>
                        <button
                            type="button"
                            className="guests__scroll"
                            aria-label="Faire défiler les intervenants"
                            onClick={() =>
                                guestsRef.current?.scrollBy({
                                    left: guestsRef.current.clientWidth / 2,
                                    behavior: 'smooth',
                                })
                            }
                        >
                            <ChevronRightIcon />
                        </button>
                    </div>
                </section>
            </div>
        </SiteLayout>
    );
}
