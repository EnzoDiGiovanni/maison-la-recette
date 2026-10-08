import { usePage } from '@inertiajs/react';
import type { ComponentProps, ReactNode } from 'react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

type Props = ComponentProps<typeof SiteHeader> & {
    children: ReactNode;
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
    ...header
}: Props) {
    const { flash } = usePage();

    return (
        <>
            <SiteHeader
                {...header}
                title={title}
                subtitle={subtitle}
                accent={accent}
            />

            {flash.success && <p role="status">{flash.success}</p>}

            <main>{children}</main>

            <SiteFooter />
        </>
    );
}
