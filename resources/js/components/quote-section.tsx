import type { ReactNode } from 'react';
import QuoteLink from '@/components/quote-link';

type Props = {
    title: string;
    /** Paramètres pré-remplissant le formulaire de contact. */
    query: Record<string, string>;
    children?: ReactNode;
};

export default function QuoteSection({ title, query, children }: Props) {
    return (
        <section>
            <h2>{title}</h2>
            {children}
            <QuoteLink query={query} />
        </section>
    );
}
