import { Link } from '@inertiajs/react';
import { formatPrice } from '@/lib/format';
import { listing } from '@/routes/experiences';
import type { Experience } from '@/types';

type Props = {
    experience: Experience;
    /** Version raccourcie pour la page d'accueil : type + titre + tagline + prix. */
    compact?: boolean;
};

export default function ExperienceCard({ experience, compact = false }: Props) {
    return (
        <li>
            {compact ? (
                <p>{experience.type.label}</p>
            ) : (
                experience.cover_image_url && (
                    <img src={experience.cover_image_url} alt="" />
                )
            )}
            <Link href={listing.url(experience.type.slug)}>
                {experience.title}
            </Link>
            {experience.tagline && <p>{experience.tagline}</p>}
            {!compact && (
                <p>
                    {experience.duration_label}
                    {experience.location && ` · ${experience.location}`}
                </p>
            )}
            <p>
                {experience.price_from === null
                    ? 'Sur devis'
                    : `À partir de ${formatPrice(experience.price_from)} par personne`}
            </p>
        </li>
    );
}
