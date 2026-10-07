import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { contact } from '@/routes';

type Props = {
    /** Formulaire de devis visé : expérience par défaut. */
    type?: 'devis_experience' | 'devis_podcast';
    children?: ReactNode;
};

export default function QuoteLink({
    type = 'devis_experience',
    children = 'Demander un devis',
}: Props) {
    const href =
        type === 'devis_podcast'
            ? contact.quote.podcast.url()
            : contact.quote.experience.url();

    return <Link href={href}>{children}</Link>;
}
