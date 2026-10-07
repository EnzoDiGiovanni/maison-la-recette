import { useState } from 'react';
import AccountDialog from '@/components/podcasts/account-dialog';

/** Encart « compte chou » de la maquette : ouvre la fenêtre profil. */
export default function PodcastCta() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <aside className="podcast-cta">
                <h2>Crée ta salade de podcast&nbsp;!</h2>
                <p>programme tes prochaines écoutes avec ton compte chou</p>
                <button type="button" onClick={() => setIsOpen(true)}>
                    Voir mon profil
                </button>
            </aside>

            <AccountDialog open={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
