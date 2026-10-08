import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { MusicIcon, SpotifyIcon } from '@/components/icons';
import { about, contact, dashboard, home, login } from '@/routes';
import { index as experiencesIndex } from '@/routes/experiences';
import { index as podcastsIndex } from '@/routes/podcasts';
import { index as postsIndex } from '@/routes/posts';

type Props = {
    /** Titre encadré au centre de la barre, ex. « Podcast ». */
    title?: string;
    /** Sous-titre sous le titre, ex. « Les ateliers ». */
    subtitle?: string;
    /** Partie en rouge : le titre par défaut, ou le sous-titre. */
    accent?: 'title' | 'subtitle';
};

export default function SiteHeader({
    title,
    subtitle,
    accent = 'title',
}: Props) {
    const { url, props } = usePage();
    const { settings, auth } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const links = [
        { label: 'Podcast', url: podcastsIndex.url() },
        { label: 'Expériences', url: experiencesIndex.url() },
        { label: 'Blog', url: postsIndex.url() },
        { label: 'À propos', url: about.url() },
        { label: 'Contact', url: contact.url() },
        auth.user
            ? { label: 'Mon compte', url: dashboard.url() }
            : { label: 'Connexion', url: login.url() },
    ];

    // Sans lien dédié, les icônes renvoient vers le smartlink Ausha.
    const spotifyUrl = settings.link_spotify ?? settings.link_ausha;
    const appleUrl = settings.link_apple_podcasts ?? settings.link_ausha;

    return (
        <header className="site-header">
            <Link href={home.url()} className="site-header__brand">
                Maison La recette
            </Link>

            {title && (
                <div className="site-header__heading">
                    <p
                        className={
                            accent === 'title'
                                ? 'site-header__title site-header__title--accent'
                                : 'site-header__title'
                        }
                    >
                        {title}
                    </p>
                    {subtitle && (
                        <p
                            className={
                                accent === 'subtitle'
                                    ? 'site-header__subtitle site-header__subtitle--accent'
                                    : 'site-header__subtitle'
                            }
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            <div className="site-header__actions">
                {spotifyUrl && (
                    <a href={spotifyUrl} aria-label="Écouter sur Spotify">
                        <SpotifyIcon />
                    </a>
                )}
                {appleUrl && (
                    <a href={appleUrl} aria-label="Écouter sur Apple Podcasts">
                        <MusicIcon />
                    </a>
                )}
                <button
                    type="button"
                    className="site-header__burger"
                    aria-label={
                        isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'
                    }
                    aria-expanded={isMenuOpen}
                    aria-controls="site-menu"
                    onClick={() => setIsMenuOpen((open) => !open)}
                >
                    <span className="site-header__burger-bar" />
                    <span className="site-header__burger-bar" />
                    <span className="site-header__burger-bar" />
                </button>
            </div>

            <nav
                id="site-menu"
                className="site-header__menu"
                data-open={isMenuOpen || undefined}
                // Replié, le menu reste dans la page pour pouvoir s'animer.
                inert={!isMenuOpen}
            >
                <ul>
                    {links.map((link) => (
                        <li key={link.label}>
                            <Link
                                href={link.url}
                                aria-current={
                                    url === link.url ||
                                    url.startsWith(`${link.url}/`)
                                        ? 'page'
                                        : undefined
                                }
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}
