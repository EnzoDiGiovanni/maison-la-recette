import { Head, Link } from '@inertiajs/react';
import QuoteSection from '@/components/quote-section';
import SessionCard from '@/components/session-card';
import TestimonialsSection from '@/components/testimonials-section';
import SiteLayout from '@/layouts/site-layout';
import { formatPrice } from '@/lib/format';
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
                            // La réservation en ligne (Stripe) reste à brancher sur la carte.
                            <SessionCard key={session.id} session={session} />
                        ))}
                    </ul>
                )}
            </section>

            <QuoteSection
                title="Pour votre équipe"
                query={{
                    type: 'devis_experience',
                    experience_type: experience.type.value,
                }}
            >
                <p>
                    Date, nombre de participant·es, lieu : cette expérience
                    s'adapte à votre événement.
                </p>
            </QuoteSection>

            <TestimonialsSection testimonials={testimonials} />
        </SiteLayout>
    );
}
