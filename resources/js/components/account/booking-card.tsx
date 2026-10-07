import { Link, router } from '@inertiajs/react';
import StatusPill from '@/components/account/status-pill';
import { formatDate, formatPrice } from '@/lib/format';
import { cancel } from '@/routes/dashboard/bookings';
import { show } from '@/routes/experiences';
import type { Booking } from '@/types';

type Props = {
    booking: Booking;
    tone: 'jaune' | 'saumon';
};

function parts(value: string) {
    const date = new Date(value);
    const format = (options: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat('fr-FR', {
            ...options,
            // Les expériences ont lieu en France : toujours l'heure de Paris.
            timeZone: 'Europe/Paris',
        }).format(date);

    return {
        day: format({ day: 'numeric' }),
        month: format({ month: 'short' }),
        rest: `${format({ weekday: 'long' })} à ${format({ hour: '2-digit', minute: '2-digit' })}`,
    };
}

/** Billet d'une réservation à venir. */
export default function BookingCard({ booking, tone }: Props) {
    const date = parts(booking.session.starts_at);

    function cancelBooking() {
        if (window.confirm('Annuler cette réservation ?')) {
            router.patch(cancel.url(booking.id), {}, { preserveScroll: true });
        }
    }

    return (
        <li className={`booking-card booking-card--${tone}`}>
            <time
                className="booking-card__date"
                dateTime={booking.session.starts_at}
            >
                <span className="booking-card__day">{date.day}</span>
                <span className="booking-card__month">{date.month}</span>
            </time>

            <div className="booking-card__body">
                <p className="booking-card__type">{booking.experience.type}</p>
                <h3 className="booking-card__title">
                    {booking.experience.is_published ? (
                        <Link href={show.url(booking.experience.slug)}>
                            {booking.experience.title}
                        </Link>
                    ) : (
                        booking.experience.title
                    )}
                </h3>
                <p className="booking-card__meta">
                    {date.rest}
                    {booking.session.location && (
                        <>
                            <br />
                            {booking.session.location}
                        </>
                    )}
                </p>
                <p className="booking-card__meta">
                    {booking.seats} {booking.seats > 1 ? 'places' : 'place'} ·{' '}
                    {formatPrice(booking.amount)}
                    {booking.paid_at &&
                        ` · réglé le ${formatDate(booking.paid_at.slice(0, 10))}`}
                </p>
            </div>

            <div className="booking-card__footer">
                <StatusPill status={booking.status} />
                {booking.can_cancel && (
                    <button
                        type="button"
                        className="link-button"
                        onClick={cancelBooking}
                    >
                        Annuler
                    </button>
                )}
            </div>
        </li>
    );
}
