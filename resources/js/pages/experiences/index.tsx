import { Head } from '@inertiajs/react';
import ExperienceCard from '@/components/experience-card';
import QuoteSection from '@/components/quote-section';
import TestimonialsSection from '@/components/testimonials-section';
import SiteLayout from '@/layouts/site-layout';
import type { Experience, Testimonial } from '@/types';

type Props = {
    experiences: Experience[];
    testimonials: Testimonial[];
};

export default function ExperiencesIndex({ experiences, testimonials }: Props) {
    // Un bloc par format (atelier, food tour, immersion), dans l'ordre d'apparition.
    const types = experiences
        .map((experience) => experience.type)
        .filter(
            (type, position, all) =>
                all.findIndex((other) => other.value === type.value) ===
                position,
        );

    return (
        <SiteLayout>
            <Head title="Expériences" />

            <h1>Les expériences</h1>
            <p>
                Des expériences clés en main et sur mesure, co-construites avec
                des professionnel·les de l'alimentation et de la gastronomie
                durable.
            </p>

            {types.map((type) => (
                <section key={type.value}>
                    <h2>{type.label}</h2>
                    <ul>
                        {experiences
                            .filter(
                                (experience) =>
                                    experience.type.value === type.value,
                            )
                            .map((experience) => (
                                <ExperienceCard
                                    key={experience.id}
                                    experience={experience}
                                />
                            ))}
                    </ul>
                </section>
            ))}

            <QuoteSection
                title="Pour les entreprises"
                query={{ type: 'devis_experience' }}
            >
                <p>
                    Dans vos locaux, chez nos partenaires ou en immersion :
                    teambuildings, séminaires, afterworks, déjeuners.
                </p>
            </QuoteSection>

            <TestimonialsSection testimonials={testimonials} />
        </SiteLayout>
    );
}
