import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

type Props = {
    title: ReactNode;
    /** Phrase d'accroche sous le titre. */
    children: ReactNode;
    href: string;
    label: string;
};

/** Encart vert d'appel à l'action : titre, accroche, bouton pilule. */
export default function CtaBlock({ title, children, href, label }: Props) {
    return (
        <aside className="account-cta">
            <h2>{title}</h2>
            <p>{children}</p>
            <Link href={href} className="btn btn--light">
                {label}
            </Link>
        </aside>
    );
}
