import { Head } from '@inertiajs/react';
import PastSlider from '@/components/experiences/past-slider';
import ReviewList from '@/components/experiences/review-list';
import UpcomingCard from '@/components/experiences/upcoming-card';
import QuoteLink from '@/components/quote-link';
import SectionTitle from '@/components/section-title';
import SiteLayout from '@/layouts/site-layout';
import type {
    ExperienceTypeLink,
    PastEvent,
    Testimonial,
    UpcomingSession,
} from '@/types';

type Props = {
    /** Format affiché, null pour l'agenda qui les réunit tous. */
    type: (ExperienceTypeLink & { value: string }) | null;
    /** Dates ouvertes à la réservation, de la plus proche à la plus lointaine. */
    sessions: UpcomingSession[];
    /** Dates déjà passées, de la plus récente à la plus ancienne. */
    pastEvents: PastEvent[];
    testimonials: Testimonial[];
};

export default function ExperiencesListing({
    type,
    sessions,
    pastEvents,
    testimonials,
}: Props) {
    const label = type?.label ?? 'Agenda';

    return (
        <SiteLayout title="Expériences" subtitle={label}>
            <Head title={`${label} · Expériences`} />

            <div className="experiences-page">
                <h1 className="sr-only">{label}</h1>

                <section>
                    <h2 className="experiences-page__heading">À venir</h2>
                    {sessions.length === 0 ? (
                        <p className="account-empty">
                            Pas de date ouverte pour le moment. Ce format
                            s'organise aussi sur mesure pour votre équipe&nbsp;:{' '}
                            <QuoteLink
                                query={
                                    type
                                        ? { experience_type: type.value }
                                        : undefined
                                }
                            >
                                demander un devis
                            </QuoteLink>
                            .
                        </p>
                    ) : (
                        <ul className="upcoming-grid">
                            {sessions.map((session) => (
                                <UpcomingCard
                                    key={session.id}
                                    session={session}
                                    showType={type === null}
                                />
                            ))}
                        </ul>
                    )}
                </section>

                {pastEvents.length > 0 && (
                    <section>
                        <h2 className="experiences-page__heading">
                            Expériences passées
                        </h2>
                        <PastSlider events={pastEvents} />
                    </section>
                )}

                {testimonials.length > 0 && (
                    <section>
                        <SectionTitle>Témoignages clients</SectionTitle>
                        <ReviewList testimonials={testimonials} />
                    </section>
                )}
            </div>
        </SiteLayout>
    );
}
