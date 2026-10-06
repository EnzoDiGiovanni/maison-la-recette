import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { about, contact, home } from '@/routes';
import { index as experiencesIndex } from '@/routes/experiences';
import {
    index as podcastsIndex,
    offers as podcastOffers,
} from '@/routes/podcasts';
import { index as postsIndex } from '@/routes/posts';

export default function SiteLayout({ children }: { children: ReactNode }) {
    const { settings } = usePage().props;
    const { flash } = usePage();

    const socialLinks = [
        { label: 'Instagram', url: settings.link_instagram },
        { label: 'LinkedIn', url: settings.link_linkedin },
    ].filter((link) => link.url);

    return (
        <>
            <header>
                <Link href={home.url()}>Maison La recette</Link>
                <nav>
                    <ul>
                        <li>
                            <Link href={podcastsIndex.url()}>Podcast</Link>
                        </li>
                        <li>
                            <Link href={podcastOffers.url()}>
                                Offres podcast
                            </Link>
                        </li>
                        <li>
                            <Link href={experiencesIndex.url()}>
                                Expériences
                            </Link>
                        </li>
                        <li>
                            <Link href={postsIndex.url()}>Blog</Link>
                        </li>
                        <li>
                            <Link href={about.url()}>À propos</Link>
                        </li>
                        <li>
                            <Link href={contact.url()}>Contact</Link>
                        </li>
                    </ul>
                </nav>
            </header>

            {flash.success && <p role="status">{flash.success}</p>}

            <main>{children}</main>

            <footer>
                {settings.contact_email && (
                    <a href={`mailto:${settings.contact_email}`}>
                        {settings.contact_email}
                    </a>
                )}
                <ul>
                    {socialLinks.map((link) => (
                        <li key={link.label}>
                            <a href={link.url ?? undefined}>{link.label}</a>
                        </li>
                    ))}
                </ul>
            </footer>
        </>
    );
}
