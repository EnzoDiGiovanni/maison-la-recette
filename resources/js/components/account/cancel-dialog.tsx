import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { formatDay, formatHour } from '@/lib/format';
import { cancel } from '@/routes/dashboard/bookings';
import type { Booking } from '@/types';

type Props = {
    booking: Booking;
    open: boolean;
    onClose: () => void;
};

/** Fenêtre de confirmation avant d'annuler une réservation. */
export default function CancelDialog({ booking, open, onClose }: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }
        if (open && !dialog.open) {
            dialog.showModal();
        }
        if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    function confirm() {
        router.patch(
            cancel.url(booking.id),
            {},
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => {
                    setProcessing(false);
                    onClose();
                },
            },
        );
    }

    return (
        <dialog
            ref={dialogRef}
            className="cancel-dialog"
            aria-labelledby={`cancel-dialog-${booking.id}`}
            onClose={onClose}
            // Un clic sur le fond (le dialog lui-même) ferme la fenêtre.
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <h2
                id={`cancel-dialog-${booking.id}`}
                className="cancel-dialog__title"
            >
                Annuler cette réservation&nbsp;?
            </h2>

            <p className="cancel-dialog__recap">
                <strong>{booking.experience.title}</strong>
                <span>
                    {formatDay(booking.session.starts_at)} à{' '}
                    {formatHour(booking.session.starts_at)}
                </span>
                <span>
                    {booking.seats} {booking.seats > 1 ? 'places' : 'place'}
                </span>
            </p>

            <p className="cancel-dialog__text">Cette action est définitive.</p>

            <div className="cancel-dialog__actions">
                <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={onClose}
                >
                    Garder ma réservation
                </button>
                <button
                    type="button"
                    className="btn cancel-dialog__confirm"
                    disabled={processing}
                    onClick={confirm}
                >
                    Oui, annuler
                </button>
            </div>
        </dialog>
    );
}
