import { Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { login } from '@/routes';

type Props = {
    open: boolean;
    onClose: () => void;
};

/**
 * Fenêtre « compte chou » de la maquette : inscription / connexion.
 * Les deux boutons e-mail mènent à la page de connexion ; Google reste en attente.
 */
export default function AccountDialog({ open, onClose }: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }
        if (open && !dialog.open) {
            dialog.showModal();
        }
        if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            className="account-dialog"
            aria-label="Inscription ou connexion"
            onClose={onClose}
            onCancel={onClose}
            // Un clic sur le fond (le dialog lui-même) ferme la fenêtre.
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <button
                type="button"
                className="account-dialog__close"
                aria-label="Fermer"
                onClick={onClose}
            >
                ×
            </button>

            <section className="account-dialog__section">
                <h2>Inscrivez-vous</h2>
                <Link
                    href={login.url()}
                    className="account-dialog__button account-dialog__button--green"
                >
                    continuez avec une adresse mail
                </Link>
                <button
                    type="button"
                    className="account-dialog__button account-dialog__button--cream"
                >
                    continuer avec google
                </button>
            </section>

            <p className="account-dialog__divider">ou</p>

            <section className="account-dialog__section">
                <h2>Connectez-vous</h2>
                <Link
                    href={login.url()}
                    className="account-dialog__button account-dialog__button--green"
                >
                    Se connecter
                </Link>
            </section>
        </dialog>
    );
}
