import type { ReactNode } from 'react';
import QuoteLink from '@/components/quote-link';

type Props = {
    title: string;
    /** Formulaire de devis visé. */
    type?: 'devis_experience' | 'devis_podcast';
    /** Paramètres pré-remplissant le formulaire (ex. experience_type). */
    query?: Record<string, string>;
    children?: ReactNode;
};

export default function QuoteSection({ title, type, query, children }: Props) {
    return (
        <section>
            <h2>{title}</h2>
            {children}
            <QuoteLink type={type} query={query} />
        </section>
    );
}
