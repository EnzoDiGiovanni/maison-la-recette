import { Head, Link } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import { formatPrice } from '@/lib/format';
import { contact } from '@/routes';
import { show } from '@/routes/experiences';
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
                                <li key={experience.id}>
                                    {experience.cover_image_url && (
                                        <img
                                            src={experience.cover_image_url}
                                            alt=""
                                        />
                                    )}
                                    <Link href={show.url(experience)}>
                                        {experience.title}
                                    </Link>
                                    {experience.tagline && (
                                        <p>{experience.tagline}</p>
                                    )}
                                    <p>
                                        {experience.duration_label}
                                        {experience.location &&
                                            ` · ${experience.location}`}
                                    </p>
                                    <p>
                                        {experience.price_from === null
                                            ? 'Sur devis'
                                            : `À partir de ${formatPrice(experience.price_from)} par personne`}
                                    </p>
                                </li>
                            ))}
                    </ul>
                </section>
            ))}

            <section>
                <h2>Pour les entreprises</h2>
                <p>
                    Dans vos locaux, chez nos partenaires ou en immersion :
                    teambuildings, séminaires, afterworks, déjeuners.
                </p>
                <Link
                    href={contact.url({ query: { type: 'devis_experience' } })}
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
