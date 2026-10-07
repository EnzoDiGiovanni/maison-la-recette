import type { ReactNode } from 'react';
import { ArrowDownRightIcon } from '@/components/icons';

/** Titre de section vert suivi de la petite flèche de la maquette. */
export default function SectionTitle({ children }: { children: ReactNode }) {
    return (
        <h2 className="section-title">
            {children}
            <ArrowDownRightIcon className="section-title__arrow" />
        </h2>
    );
}
