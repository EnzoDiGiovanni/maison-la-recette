import { Link } from '@inertiajs/react';
import { useState } from 'react';
import CancelDialog from '@/components/account/cancel-dialog';
import StatusPill from '@/components/account/status-pill';
import { PaperPlaneIcon } from '@/components/icons';
import { formatDate, formatPrice } from '@/lib/format';
import { listing } from '@/routes/experiences';
import { show } from '@/routes/sessions';
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
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Partage la page de la date : menu de partage du téléphone, sinon
    // le lien est copié dans le presse-papiers.
    async function invite() {
        const url = window.location.origin + show.url(booking.session.id);

        try {
            if (navigator.share) {
                await navigator.share({
                    title: booking.experience.title,
                    text: `Je participe à « ${booking.experience.title} » avec Maison La recette. Tu viens ?`,
                    url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                setIsCopied(true);
                window.setTimeout(() => setIsCopied(false), 2500);
            }
        } catch {
            // Partage annulé ou presse-papiers refusé : rien à signaler.
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
                <h3 className="booking-card__title">
                    {booking.experience.is_published ? (
                        <Link href={listing.url(booking.experience.type_slug)}>
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
                    <strong>
                        {booking.seats} {booking.seats > 1 ? 'places' : 'place'}
                    </strong>{' '}
                    · {formatPrice(booking.amount)}
                    {booking.paid_at &&
                        ` · réglé le ${formatDate(booking.paid_at.slice(0, 10))}`}
                </p>
                {/* Une réservation réglée n'a pas besoin de pastille. */}
                {booking.status.value !== 'paid' && (
                    <StatusPill status={booking.status} />
                )}
            </div>

            <div className="booking-card__footer">
                {booking.experience.is_published && (
                    <button
                        type="button"
                        className="btn booking-card__invite"
                        onClick={invite}
                    >
                        <span aria-live="polite">
                            {isCopied ? 'Lien copié !' : 'Inviter des ami·es'}
                        </span>
                        <PaperPlaneIcon />
                    </button>
                )}
                {booking.can_cancel && (
                    <>
                        <button
                            type="button"
                            className="link-button booking-card__cancel"
                            onClick={() => setIsCancelOpen(true)}
                        >
                            Annuler
                        </button>
                        <CancelDialog
                            booking={booking}
                            open={isCancelOpen}
                            onClose={() => setIsCancelOpen(false)}
                        />
                    </>
                )}
            </div>
        </li>
    );
}
