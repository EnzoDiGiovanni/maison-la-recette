import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AccountDialog from '@/components/podcasts/account-dialog';
import { dashboard } from '@/routes';

/**
 * Encart « compte chou » de la maquette : ouvre la fenêtre de connexion,
 * ou mène directement à l'espace compte une fois connecté·e.
 */
export default function PodcastCta() {
    const { user } = usePage().props.auth;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <aside className="podcast-cta">
                <h2>Crée ta salade de podcast&nbsp;!</h2>
                <p>programme tes prochaines écoutes avec ton compte chou</p>
                {user ? (
                    <Link
                        href={dashboard.url()}
                        className="podcast-cta__button"
                    >
                        Voir mon profil
                    </Link>
                ) : (
                    <button
                        type="button"
                        className="podcast-cta__button"
                        onClick={() => setIsOpen(true)}
                    >
                        Voir mon profil
                    </button>
                )}
            </aside>

            {!user && (
                <AccountDialog open={isOpen} onClose={() => setIsOpen(false)} />
            )}
        </>
    );
}
