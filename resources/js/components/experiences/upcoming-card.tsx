import { Link } from '@inertiajs/react';
import { formatDay } from '@/lib/format';
import { show } from '@/routes/sessions';
import type { UpcomingSession } from '@/types';

type Props = {
    session: UpcomingSession;
    /** Rappelle le format devant le titre, quand la liste les mélange. */
    showType?: boolean;
};

/** Carte d'une date à venir : bandeau jaune, résumé et lien vers le détail. */
export default function UpcomingCard({ session, showType = false }: Props) {
    const { experience } = session;
    const location = session.location ?? experience.location;

    return (
        <li className="upcoming-card">
            <div className="upcoming-card__head">
                <time
                    className="upcoming-card__date"
                    dateTime={session.starts_at}
                >
                    {formatDay(session.starts_at)}
                </time>
                <h3 className="upcoming-card__title">
                    {showType && `${experience.type.label} · `}
                    {experience.title}
                </h3>
                {location && <p className="upcoming-card__place">{location}</p>}
            </div>
            <div className="upcoming-card__body">
                {experience.description && (
                    <p className="upcoming-card__text">
                        {experience.description}
                    </p>
                )}
                {session.remaining_seats === 0 && (
                    <p className="upcoming-card__full">Complet</p>
                )}
                {/* Le détail et la réservation partagent la même page. */}
                <Link href={show.url(session.id)} className="btn">
                    Voir plus de détail
                </Link>
            </div>
        </li>
    );
}
