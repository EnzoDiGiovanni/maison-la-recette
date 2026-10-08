import { useRef } from 'react';
import type { ReactNode } from 'react';
import type { Experience } from '@/types';

type Props = {
    experience: Experience;
    /** Classes du bouton qui ouvre la fenêtre. */
    className: string;
    children: ReactNode;
};

/**
 * Bouton « Voir les photos » et sa fenêtre : la couverture puis la galerie
 * de l'expérience. Sans aucune photo, le bouton n'est pas affiché.
 */
export default function PhotoDialog({
    experience,
    className,
    children,
}: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const photos = [
        ...(experience.cover_image_url ? [experience.cover_image_url] : []),
        ...experience.photo_urls,
    ];

    if (photos.length === 0) {
        return null;
    }

    return (
        <>
            <button
                type="button"
                className={className}
                onClick={() => dialogRef.current?.showModal()}
            >
                {children}
            </button>

            <dialog
                ref={dialogRef}
                className="photo-dialog"
                aria-label={`Photos : ${experience.title}`}
                // Un clic sur le fond (le dialog lui-même) ferme la fenêtre.
                onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        dialogRef.current?.close();
                    }
                }}
            >
                <div className="photo-dialog__panel">
                    <h2 className="photo-dialog__title">{experience.title}</h2>
                    <button
                        type="button"
                        className="photo-dialog__close"
                        aria-label="Fermer"
                        onClick={() => dialogRef.current?.close()}
                    >
                        ×
                    </button>
                    <ul className="photo-dialog__grid">
                        {photos.map((url) => (
                            <li key={url}>
                                <img src={url} alt="" loading="lazy" />
                            </li>
                        ))}
                    </ul>
                </div>
            </dialog>
        </>
    );
}
