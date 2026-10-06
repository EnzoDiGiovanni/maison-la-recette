import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { contact } from '@/routes';

type Props = {
    /** Paramètres pré-remplissant le formulaire de contact. */
    query?: Record<string, string>;
    children?: ReactNode;
};

export default function QuoteLink({
    query,
    children = 'Demander un devis',
}: Props) {
    return (
        <Link href={query ? contact.url({ query }) : contact.url()}>
            {children}
        </Link>
    );
}
