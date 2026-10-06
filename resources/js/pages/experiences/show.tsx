import { Head, Link } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import { formatDateTime, formatPrice } from '@/lib/format';
import { contact } from '@/routes';
import { index } from '@/routes/experiences';
import type { Experience, ExperienceSession, Testimonial } from '@/types';

type Props = {
    experience: Experience;
    /** Sessions ouvertes et à venir. Vide pour une expérience sur devis. */
    sessions: ExperienceSession[];
    testimonials: Testimonial[];
};

export default function ExperiencesShow({
    experience,
    sessions,
    testimonials,
}: Props) {
    return (
        <SiteLayout>
            <Head title={experience.title} />

            <Link href={index.url()}>Toutes les expériences</Link>

            <article>
                <p>{experience.type.label}</p>
                <h1>{experience.title}</h1>
                {experience.tagline && <p>{experience.tagline}</p>}

                {experience.cover_image_url && (
                    <img src={experience.cover_image_url} alt="" />
                )}

                {experience.description && <p>{experience.description}</p>}

                <ul>
                    {experience.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                    ))}
                </ul>

                <dl>
                    {experience.duration_label && (
                        <div>
                            <dt>Durée</dt>
                            <dd>{experience.duration_label}</dd>
                        </div>
                    )}
                    {experience.location && (
                        <div>
                            <dt>Lieu</dt>
                            <dd>{experience.location}</dd>
                        </div>
                    )}
                    <div>
                        <dt>Tarif</dt>
                        <dd>
                            {experience.price_from === null
                                ? 'Sur devis'
                                : `À partir de ${formatPrice(experience.price_from)} par personne`}
                        </dd>
                    </div>
                </dl>

                <ul>
                    {experience.photo_urls.map((url) => (
                        <li key={url}>
                            <img src={url} alt="" />
                        </li>
                    ))}
                </ul>
            </article>

            <section>
                <h2>Prochaines dates</h2>
                {sessions.length === 0 ? (
                    <p>Aucune date programmée pour le moment.</p>
                ) : (
                    <ul>
                        {sessions.map((session) => (
                            <li key={session.id}>
                                <time dateTime={session.starts_at}>
                                    {formatDateTime(session.starts_at)}
                                </time>
                                {session.location && <p>{session.location}</p>}
                                <p>{formatPrice(session.price)} par personne</p>
                                <p>
                                    {session.remaining_seats > 0
                                        ? `${session.remaining_seats} places restantes sur ${session.capacity}`
                                        : 'Complet'}
                                </p>
                                {/* La réservation en ligne (Stripe) reste à brancher ici. */}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h2>Pour votre équipe</h2>
                <p>
                    Date, nombre de participant·es, lieu : cette expérience
                    s'adapte à votre événement.
                </p>
                <Link
                    href={contact.url({
                        query: {
                            type: 'devis_experience',
                            experience_type: experience.type.value,
                        },
                    })}
                >
                    Demander un devis
                </Link>
            </section>

            <section>
                <h2>Avis de nos client·es</h2>
                <ul>
                    {testimonials.map((testimonial) => (
                        <li key={testimonial.id}>
                            <blockquote>{testimonial.quote}</blockquote>
                            <p>
                                {testimonial.author_name}
                                {testimonial.author_role &&
                                    `, ${testimonial.author_role}`}
                            </p>
                        </li>
                    ))}
                </ul>
            </section>
        </SiteLayout>
    );
}
