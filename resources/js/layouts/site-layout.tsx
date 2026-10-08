import { usePage } from '@inertiajs/react';
import type { ComponentProps, ReactNode } from 'react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

type Props = ComponentProps<typeof SiteHeader> & {
    children: ReactNode;
};

export default function SiteLayout({ children, ...header }: Props) {
    const { flash } = usePage();

    return (
        <>
            <SiteHeader {...header} />

            {flash.success && <p role="status">{flash.success}</p>}

            <main>{children}</main>

            <SiteFooter />
        </>
    );
}
