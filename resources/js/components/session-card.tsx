import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import TextField from '@/components/forms/text-field';
import QuoteLink from '@/components/quote-link';
import { formatDateTime, formatPrice } from '@/lib/format';
import { create } from '@/routes/bookings';
import type { ExperienceSession } from '@/types';

export default function SessionCard({
    session,
}: {
    session: ExperienceSession;
}) {
    const { user } = usePage().props.auth;
    const [seats, setSeats] = useState('1');
    const count = Number(seats) || 0;

    // Vers la page de paiement ; sans compte, la connexion s'intercale.
    function submit(event: FormEvent) {
        event.preventDefault();

        router.visit(create.url(session.id, { query: { seats } }));
    }

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

            {session.remaining_seats > 0 &&
                user?.account_type !== 'entreprise' && (
                    <form onSubmit={submit}>
                        <TextField
                            id={`seats-${session.id}`}
                            label="Nombre de places"
                            type="number"
                            required
                            min={1}
                            max={session.remaining_seats}
                            value={seats}
                            onChange={setSeats}
                        />
                        <button type="submit">
                            Réserver
                            {count > 0 &&
                                ` · ${formatPrice(count * session.price)}`}
                        </button>
                    </form>
                )}

            {user?.account_type === 'entreprise' && (
                <p>
                    La réservation en ligne est réservée aux particuliers.{' '}
                    <QuoteLink query={{ type: 'devis_experience' }}>
                        Demander un devis pour votre équipe
                    </QuoteLink>
                </p>
            )}
        </li>
    );
}
