import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import quote from '@/routes/contact/quote';

type Props = {
    /** Formulaire de devis visé : expérience par défaut. */
    type?: 'devis_experience' | 'devis_podcast';
    /** Paramètres pré-remplissant le formulaire (ex. experience_type). */
    query?: Record<string, string>;
    children?: ReactNode;
};

export default function QuoteLink({
    type = 'devis_experience',
    query,
    children = 'Demander un devis',
}: Props) {
    const route = type === 'devis_podcast' ? quote.podcast : quote.experience;

    return (
        <Link href={query ? route.url({ query }) : route.url()}>
            {children}
        </Link>
    );
}
