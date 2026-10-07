import { Head, Link } from '@inertiajs/react';
import { useRef } from 'react';
import CtaBlock from '@/components/cta-block';
import { ChevronRightIcon } from '@/components/icons';
import Cover from '@/components/podcasts/cover';
import SiteLayout from '@/layouts/site-layout';
import { formatDate } from '@/lib/format';
import { contact } from '@/routes';
import { show } from '@/routes/experiences';
import type { LatestExperience, PastEvent } from '@/types';

type Props = {
    /** Les trois dernières expériences ajoutées, tous formats confondus. */
    latestExperiences: LatestExperience[];
    /** Dates déjà passées, de la plus récente à la plus ancienne. */
    pastEvents: PastEvent[];
};

function nextDate(value: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        // Les expériences ont lieu en France : toujours l'heure de Paris.
        timeZone: 'Europe/Paris',
    }).format(new Date(value));
}

export default function ExperiencesIndex({
    latestExperiences,
    pastEvents,
}: Props) {
    const sliderRef = useRef<HTMLUListElement>(null);

    return (
        <SiteLayout title="Expériences" subtitle="En vrai, à Lyon">
            <Head title="Expériences" />

            <div className="experiences-page">
                <h1 className="sr-only">Les expériences Maison La recette</h1>

                <section>
                    <h2 className="experiences-page__heading">À venir</h2>
                    {latestExperiences.length === 0 ? (
                        <p className="account-empty">
                            Les prochaines expériences mijotent encore.
                        </p>
                    ) : (
                        <ul className="experience-grid">
                            {latestExperiences.map((experience) => (
                                <li
                                    key={experience.id}
                                    className="experience-card"
                                >
                                    <Link href={show.url(experience)}>
                                        <Cover
                                            src={experience.cover_image_url}
                                            className="experience-card__photo"
                                        />
                                        <div className="experience-card__body">
                                            <p className="experience-card__type">
                                                {experience.type.label}
                                            </p>
                                            <h3 className="experience-card__title">
                                                {experience.title}
                                            </h3>
                                            <p className="experience-card__meta">
                                                {experience.next_session_at
                                                    ? `Prochaine date : ${nextDate(experience.next_session_at)}`
                                                    : 'Programme à confirmer'}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {pastEvents.length > 0 && (
                    <section>
                        <h2 className="experiences-page__heading experiences-page__heading--light">
                            Évènements passés
                        </h2>
                        <div className="past-slider">
                            <ul className="past-slider__track" ref={sliderRef}>
                                {pastEvents.map((event) => (
                                    <li key={event.id} className="past-card">
                                        <div className="past-card__panel">
                                            <Cover
                                                src={
                                                    event.experience
                                                        .cover_image_url
                                                }
                                                className="past-card__photo"
                                            />
                                            <div className="past-card__body">
                                                <h3 className="past-card__title">
                                                    {event.experience.title}
                                                </h3>
                                                <p className="past-card__meta">
                                                    Souvenirs du{' '}
                                                    {formatDate(
                                                        event.starts_at.slice(
                                                            0,
                                                            10,
                                                        ),
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href={`${show.url(event.experience)}#photos`}
                                            className="past-card__button"
                                        >
                                            Voir les photos
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            {pastEvents.length > 3 && (
                                <button
                                    type="button"
                                    className="past-slider__next"
                                    aria-label="Faire défiler les évènements passés"
                                    onClick={() => {
                                        const track = sliderRef.current;

                                        if (!track) {
                                            return;
                                        }
                                        // Arrivé au bout, on revient au début.
                                        const atEnd =
                                            track.scrollLeft +
                                                track.clientWidth >=
                                            track.scrollWidth - 4;

                                        track.scrollTo({
                                            left: atEnd
                                                ? 0
                                                : track.scrollLeft +
                                                  track.clientWidth / 3,
                                            behavior: 'smooth',
                                        });
                                    }}
                                >
                                    <ChevronRightIcon />
                                </button>
                            )}
                        </div>
                    </section>
                )}

                <CtaBlock
                    title={<>Un projet pour votre équipe&nbsp;?</>}
                    href={contact.url({ query: { type: 'devis_experience' } })}
                    label="Demander un devis"
                >
                    Dans vos locaux, chez nos partenaires ou en immersion :
                    teambuildings, séminaires, afterworks, déjeuners, sur mesure
                    et sur devis.
                </CtaBlock>
            </div>
        </SiteLayout>
    );
}
