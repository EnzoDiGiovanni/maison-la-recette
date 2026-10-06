import { formatDateTime, formatPrice } from '@/lib/format';
import type { ExperienceSession } from '@/types';

export default function SessionCard({
    session,
}: {
    session: ExperienceSession;
}) {
    return (
        <li>
            <time dateTime={session.starts_at}>
                {formatDateTime(session.starts_at)}
            </time>
            {session.location && <p>{session.location}</p>}
            <p>{formatPrice(session.price)} par personne</p>
            <p>
                {session.remaining_seats > 0
                    ? `${session.remaining_seats} places restantes sur ${session.capacity}`
                    : 'Complet'}
            </p>
        </li>
    );
}
