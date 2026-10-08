import { Link, usePage } from '@inertiajs/react';
import { register } from '@/routes';

/** Nombre de répétitions du message dans chaque moitié de la boucle. */
const REPEATS = 6;

/**
 * Bandeau défilant fixé en bas de l'écran, sur l'accueil. Activé et rédigé depuis le back
 * office (Réglages → Bannière de la page d'accueil).
 */
export default function HomeBanner() {
    const { settings } = usePage().props;
    const label = settings.banner_link_label?.trim();
    const text = settings.banner_text?.trim();

    if (settings.banner_enabled !== '1' || (!label && !text)) {
        return null;
    }

    // Les copies ne servent qu'au défilement : seule la première est lue et
    // atteignable au clavier.
    const message = (isCopy: boolean) => (
        <p className="home-banner__message" aria-hidden={isCopy || undefined}>
            {label &&
                (settings.banner_link_url ? (
                    <a
                        href={settings.banner_link_url}
                        tabIndex={isCopy ? -1 : undefined}
                    >
                        {label}
                    </a>
                ) : (
                    <Link
                        href={register.url()}
                        tabIndex={isCopy ? -1 : undefined}
                    >
                        {label}
                    </Link>
                ))}
            {label && text && ' '}
            {text}
        </p>
    );

    return (
        <aside className="home-banner" aria-label="Annonce">
            <div className="home-banner__track">
                {Array.from({ length: REPEATS * 2 }, (_, index) => (
                    <div key={index} className="home-banner__item">
                        {message(index > 0)}
                    </div>
                ))}
            </div>
        </aside>
    );
}
