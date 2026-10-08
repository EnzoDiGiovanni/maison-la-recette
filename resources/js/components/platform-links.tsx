import { usePage } from '@inertiajs/react';
import { MicIcon } from '@/components/icons';
import PlatformIcon from '@/components/podcasts/platform-icon';
import SectionTitle from '@/components/section-title';
import { listeningPlatforms } from '@/lib/podcast';

/**
 * Liens vers les plateformes d'écoute de l'émission (Réglages du back-office).
 * Rien ne s'affiche tant qu'aucun lien n'est renseigné.
 */
export default function PlatformLinks() {
    const { settings } = usePage().props;
    const platforms = listeningPlatforms(settings);

    if (!settings.link_ausha && platforms.length === 0) {
        return null;
    }

    return (
        <section className="platform-links reveal">
            <SectionTitle>Écoute où tu veux</SectionTitle>
            <ul>
                {settings.link_ausha && (
                    <li>
                        <a
                            href={settings.link_ausha}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <MicIcon />
                            Ausha
                        </a>
                    </li>
                )}
                {platforms.map((platform) => (
                    <li key={platform.key}>
                        <a
                            href={platform.url ?? undefined}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <PlatformIcon platform={platform.key} />
                            {platform.label}
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
}
