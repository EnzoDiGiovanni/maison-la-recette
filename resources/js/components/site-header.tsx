import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { MenuIcon, MusicIcon, SpotifyIcon } from '@/components/icons';
import { about, contact, home } from '@/routes';
import { index as experiencesIndex } from '@/routes/experiences';
import {
    index as podcastsIndex,
    offers as podcastOffers,
} from '@/routes/podcasts';
import { index as postsIndex } from '@/routes/posts';

type Props = {
    /** Titre encadré au centre de la barre, ex. « Podcast ». */
    title?: string;
};

export default function SiteHeader({ title }: Props) {
    const { url, props } = usePage();
    const { settings } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const links = [
        { label: 'Podcast', url: podcastsIndex.url() },
        { label: 'Offres podcast', url: podcastOffers.url() },
        { label: 'Expériences', url: experiencesIndex.url() },
        { label: 'Blog', url: postsIndex.url() },
        { label: 'À propos', url: about.url() },
        { label: 'Contact', url: contact.url() },
    ];

    // Sans lien dédié, les icônes renvoient vers le smartlink Ausha.
    const spotifyUrl = settings.link_spotify ?? settings.link_ausha;
    const appleUrl = settings.link_apple_podcasts ?? settings.link_ausha;

    return (
        <header className="site-header">
            <Link href={home.url()} className="site-header__brand">
                Maison La recette
            </Link>

            {title && <p className="site-header__title">{title}</p>}

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
                    aria-label="Menu"
                    aria-expanded={isMenuOpen}
                    aria-controls="site-menu"
                    onClick={() => setIsMenuOpen((open) => !open)}
                >
                    <MenuIcon />
                </button>
            </div>

            <nav
                id="site-menu"
                className="site-header__menu"
                hidden={!isMenuOpen}
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
