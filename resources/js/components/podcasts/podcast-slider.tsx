import { useRef } from 'react';
import type { ReactNode } from 'react';
import { ChevronRightIcon } from '@/components/icons';

type Props = {
    /** Ce que la rangée fait défiler, pour les lecteurs d'écran : « extraits ». */
    label: string;
    children: ReactNode;
};

/** Rangée de cartes défilante, avec une flèche de chaque côté. */
export default function PodcastSlider({ label, children }: Props) {
    const rowRef = useRef<HTMLUListElement>(null);

    const scroll = (direction: 1 | -1) =>
        rowRef.current?.scrollBy({
            left: (direction * rowRef.current.clientWidth) / 2,
            behavior: 'smooth',
        });

    return (
        <div className="guests">
            <button
                type="button"
                className="guests__scroll guests__scroll--prev"
                aria-label={`Revenir en arrière dans les ${label}`}
                onClick={() => scroll(-1)}
            >
                <ChevronRightIcon />
            </button>
            <ul className="podcast-row" ref={rowRef}>
                {children}
            </ul>
            <button
                type="button"
                className="guests__scroll"
                aria-label={`Faire défiler les ${label}`}
                onClick={() => scroll(1)}
            >
                <ChevronRightIcon />
            </button>
        </div>
    );
}
