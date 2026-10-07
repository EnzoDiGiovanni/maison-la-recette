import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

type Props = {
    children: ReactNode;
    /** Titre encadré affiché au centre de la barre de navigation. */
    title?: string;
};

export default function SiteLayout({ children, title }: Props) {
    const { flash } = usePage();

    return (
        <>
            <SiteHeader title={title} />

            {flash.success && <p role="status">{flash.success}</p>}

            <main>{children}</main>

            <SiteFooter />
        </>
    );
}
