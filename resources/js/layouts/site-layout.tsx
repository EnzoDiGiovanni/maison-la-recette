import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

type Props = {
    children: ReactNode;
    /** Titre encadré affiché au centre de la barre de navigation. */
    title?: string;
    /** Sous-titre affiché sous le titre encadré. */
    subtitle?: string;
    /**
     * Partie de l'en-tête en rouge : le titre par défaut, le sous-titre sur
     * l'étape de réservation.
     */
    accent?: 'title' | 'subtitle';
};

export default function SiteLayout({
    children,
    title,
    subtitle,
    accent,
}: Props) {
    const { flash } = usePage();

    return (
        <>
            <SiteHeader title={title} subtitle={subtitle} accent={accent} />

            {flash.success && <p role="status">{flash.success}</p>}

            <main>{children}</main>

            <SiteFooter />
        </>
    );
}
