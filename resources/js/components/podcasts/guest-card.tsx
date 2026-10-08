import { Link } from '@inertiajs/react';
import Cover from '@/components/podcasts/cover';
import { show } from '@/routes/podcasts';
import type { Podcast } from '@/types';

type Props = {
    name: string;
    photoUrl: string | null;
    /** Épisode vers lequel renvoie la carte de l'intervenant·e. */
    podcast: Podcast;
};

/** Carte d'intervenant·e : portrait, prénom puis nom sur deux lignes. */
export default function GuestCard({ name, photoUrl, podcast }: Props) {
    const [firstName, ...lastName] = name.split(' ');

    return (
        <li className="guest-card">
            <Link href={show.url(podcast)}>
                <Cover src={photoUrl} className="guest-card__photo" />
                <span className="guest-card__name">
                    {firstName}
                    {lastName.length > 0 && (
                        <>
                            <br />
                            {lastName.join(' ')}
                        </>
                    )}
                </span>
            </Link>
        </li>
    );
}
