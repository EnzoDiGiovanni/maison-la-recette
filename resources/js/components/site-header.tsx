import { Link } from '@inertiajs/react';
import { about, contact, home } from '@/routes';
import { index as experiencesIndex } from '@/routes/experiences';
import {
    index as podcastsIndex,
    offers as podcastOffers,
} from '@/routes/podcasts';
import { index as postsIndex } from '@/routes/posts';

export default function SiteHeader() {
    const links = [
        { label: 'Podcast', url: podcastsIndex.url() },
        { label: 'Offres podcast', url: podcastOffers.url() },
        { label: 'Expériences', url: experiencesIndex.url() },
        { label: 'Blog', url: postsIndex.url() },
        { label: 'À propos', url: about.url() },
        { label: 'Contact', url: contact.url() },
    ];

    return (
        <header>
            <Link href={home.url()}>Maison La recette</Link>
            <nav>
                <ul>
                    {links.map((link) => (
                        <li key={link.label}>
                            <Link href={link.url}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}
