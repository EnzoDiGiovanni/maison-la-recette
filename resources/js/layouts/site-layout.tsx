import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

export default function SiteLayout({ children }: { children: ReactNode }) {
    const { flash } = usePage();

    return (
        <>
            <SiteHeader />

            {flash.success && <p role="status">{flash.success}</p>}

            <main>{children}</main>

            <SiteFooter />
        </>
    );
}
