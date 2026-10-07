import type { ReactNode } from 'react';
import { ArrowDownRightIcon } from '@/components/icons';

type Props = {
    children: ReactNode;
    /** Niveau de titre : h2 par défaut, h1 pour le titre de page. */
    as?: 'h1' | 'h2';
};

/** Titre de section vert suivi de la petite flèche de la maquette. */
export default function SectionTitle({ children, as: Tag = 'h2' }: Props) {
    return (
        <Tag className="section-title">
            {children}
            <ArrowDownRightIcon className="section-title__arrow" />
        </Tag>
    );
}
