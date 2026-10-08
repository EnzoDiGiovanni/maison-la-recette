import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { InstagramIcon, LinkedinIcon, MicIcon } from '@/components/icons';
import { about, contact, dashboard, home, login, studio } from '@/routes';
import { index as experiencesIndex } from '@/routes/experiences';
import { index as podcastsIndex } from '@/routes/podcasts';
import { index as postsIndex } from '@/routes/posts';
import logoImg from '../../images/logo.png';

type Props = {
    /** Titre au centre de la barre, ex. « Podcast ». */
    title?: string;
    /** Sous-titre sous le titre, ex. « Les ateliers ». */
    subtitle?: string;
    /** Accueil : le titre est le h1 de la page, sans les deux filets. */
    isHome?: boolean;
};

export default function SiteHeader({ title, subtitle, isHome = false }: Props) {
    const { url, props } = usePage();
    const { settings, auth } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const links = [
        { label: 'Podcast', url: podcastsIndex.url() },
        { label: 'Studio', url: studio.url() },
        { label: 'Expériences', url: experiencesIndex.url() },
        { label: 'Blog', url: postsIndex.url() },
        { label: 'À propos', url: about.url() },
        { label: 'Contact', url: contact.url() },
        auth.user
            ? { label: 'Mon compte', url: dashboard.url() }
            : { label: 'Connexion', url: login.url() },
    ];

    // Le micro renvoie vers le smartlink Ausha, sinon vers la page podcast.
    const listenUrl = settings.link_ausha;

    return (
        <header className="site-header">
            <Link
                href={home.url()}
                className="site-header__brand"
                aria-label="Maison La recette, accueil"
            >
                <img src={logoImg} alt="Maison La recette" />
            </Link>

            {title && (
                <div className="site-header__heading">
                    {isHome ? (
                        <h1 className="site-header__title">{title}</h1>
                    ) : (
                        <p className="site-header__title site-header__title--framed">
                            {title}
                        </p>
                    )}
                    {subtitle && (
                        <p className="site-header__subtitle">{subtitle}</p>
                    )}
                </div>
            )}

            <div className="site-header__actions">
                <div className="site-header__socials">
                    {settings.link_linkedin && (
                        <a href={settings.link_linkedin} aria-label="LinkedIn">
                            <LinkedinIcon />
                        </a>
                    )}
                    {settings.link_instagram && (
                        <a
                            href={settings.link_instagram}
                            aria-label="Instagram"
                        >
                            <InstagramIcon />
                        </a>
                    )}
                    {listenUrl ? (
                        <a href={listenUrl} aria-label="Écouter le podcast">
                            <MicIcon />
                        </a>
                    ) : (
                        <Link
                            href={podcastsIndex.url()}
                            aria-label="Les podcasts"
                        >
                            <MicIcon />
                        </Link>
                    )}
                </div>
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
