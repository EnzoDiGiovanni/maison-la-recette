import { Link, usePage } from '@inertiajs/react';
import { contact, dashboard, home, login, studio } from '@/routes';
import { index as experiencesIndex } from '@/routes/experiences';
import { index as podcastsIndex } from '@/routes/podcasts';

/** Pied de page vert, commun à toutes les pages du site. */
export default function SiteFooter() {
    const { settings, auth } = usePage().props;

    const links = [
        {
            label: 'Mon compte',
            url: auth.user ? dashboard.url() : login.url(),
        },
        { label: 'Contact', url: contact.url() },
        { label: 'Accueil', url: home.url() },
        { label: 'Studio', url: studio.url() },
        { label: 'Podcast', url: podcastsIndex.url() },
        { label: 'Expériences', url: experiencesIndex.url() },
    ];

    return (
        <footer className="site-footer">
            <div className="site-footer__brand">
                <span>Maison La Recette</span>
                {settings.contact_email && (
                    <a href={`mailto:${settings.contact_email}`}>
                        {settings.contact_email}
                    </a>
                )}
            </div>

            <nav aria-label="Pied de page">
                {links.map((link) => (
                    <Link key={link.label} href={link.url}>
                        {link.label}
                    </Link>
                ))}
            </nav>
        </footer>
    );
}
