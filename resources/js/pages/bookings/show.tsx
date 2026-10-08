import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import QuoteLink from '@/components/quote-link';
import SiteLayout from '@/layouts/site-layout';
import { formatDay, formatHour, formatPrice } from '@/lib/format';
import { create } from '@/routes/bookings';
import type { Experience, ExperienceSession } from '@/types';

type Props = {
    experience: Experience;
    session: ExperienceSession;
};

/** Places proposées d'un coup, comme la limite acceptée au paiement. */
const MAX_SEATS = 20;

/**
 * Détail et réservation d'une date : tout ce que le back-office renseigne sur
 * l'expérience (accroche, description, points forts, galerie) et le choix du
 * nombre de places.
 */
export default function BookingsShow({ experience, session }: Props) {
    const { user } = usePage().props.auth;
    const [seats, setSeats] = useState('1');

    const location = session.location ?? experience.location;
    const remaining = session.remaining_seats;
    const isCompany = user?.account_type === 'entreprise';

    // Vers la page de paiement ; sans compte, la connexion s'intercale.
    function submit(event: FormEvent) {
        event.preventDefault();

        router.visit(create.url(session.id, { query: { seats } }));
    }

    return (
        <SiteLayout title="Expériences" subtitle="Réservation">
            <Head title={`Réservation · ${experience.title}`} />

            <div className="reservation-page">
                <div className="reservation-page__intro">
                    <h1 className="reservation-page__title">
                        {experience.title}
                    </h1>
                    {experience.tagline && (
                        <p className="reservation-page__tagline">
                            {experience.tagline}
                        </p>
                    )}
                    <p className="reservation-page__date">
                        <time dateTime={session.starts_at}>
                            {formatDay(session.starts_at)}
                        </time>
                        Début à {formatHour(session.starts_at)}
                    </p>
                    <p className="reservation-page__seats">
                        {remaining === 0
                            ? 'Complet'
                            : `${remaining} ${remaining > 1 ? 'places restantes' : 'place restante'}`}
                    </p>
                </div>

                {experience.description && (
                    <p className="reservation-page__text">
                        {experience.description}
                    </p>
                )}

                <dl className="reservation-page__facts">
                    {experience.duration_label && (
                        <div>
                            <dt>Durée</dt>
                            <dd>{experience.duration_label}</dd>
                        </div>
                    )}
                    <div>
                        <dt>Tarif</dt>
                        <dd>{formatPrice(session.price)} par personne</dd>
                    </div>
                    {location && (
                        <div>
                            <dt>Lieu</dt>
                            <dd>{location}</dd>
                        </div>
                    )}
                </dl>

                <div className="reservation-card">
                    <h2 className="reservation-card__title">
                        {experience.title}
                    </h2>

                    {isCompany ? (
                        <p className="reservation-card__note">
                            La réservation en ligne est réservée aux
                            particuliers.{' '}
                            <QuoteLink
                                query={{
                                    experience_type: experience.type.value,
                                }}
                            >
                                Demander un devis pour votre équipe
                            </QuoteLink>
                        </p>
                    ) : remaining === 0 ? (
                        <p className="reservation-card__note">
                            Cette date est complète.
                        </p>
                    ) : (
                        <form onSubmit={submit}>
                            <label htmlFor="seats">Nombre de places</label>
                            <div className="reservation-card__select">
                                <select
                                    id="seats"
                                    value={seats}
                                    onChange={(event) =>
                                        setSeats(event.target.value)
                                    }
                                >
                                    {Array.from(
                                        {
                                            length: Math.min(
                                                remaining,
                                                MAX_SEATS,
                                            ),
                                        },
                                        (_, index) => (
                                            <option key={index + 1}>
                                                {index + 1}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="reservation-card__submit"
                            >
                                Réserver ·{' '}
                                {formatPrice(Number(seats) * session.price)}
                            </button>
                        </form>
                    )}
                </div>

                {experience.highlights.length > 0 && (
                    <section className="reservation-page__more">
                        <h2 className="reservation-page__heading">
                            Au programme
                        </h2>
                        <ol className="reservation-steps">
                            {experience.highlights.map((highlight) => (
                                <li key={highlight}>{highlight}</li>
                            ))}
                        </ol>
                    </section>
                )}

                {experience.photo_urls.length > 0 && (
                    <section className="reservation-page__more">
                        <h2 className="reservation-page__heading">En images</h2>
                        <ul className="reservation-gallery">
                            {experience.photo_urls.map((url) => (
                                <li key={url}>
                                    <img src={url} alt="" loading="lazy" />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </SiteLayout>
    );
}
