import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import TextField from '@/components/forms/text-field';
import SiteLayout from '@/layouts/site-layout';
import { formatDateTime, formatPrice } from '@/lib/format';
import { store } from '@/routes/bookings';
import { show } from '@/routes/experiences';
import type { Experience, ExperienceSession } from '@/types';

type Props = {
    experience: Experience;
    session: ExperienceSession;
    /** Nombre de places choisi sur la page de l'expérience. */
    seats: number;
};

/** Paiement de démonstration : rien n'est débité ni conservé. */
export default function BookingsCheckout({
    experience,
    session,
    seats,
}: Props) {
    const { user } = usePage().props.auth;

    const form = useForm({
        seats: String(seats),
        card_name: user?.name ?? '',
        card_number: '',
        card_expiry: '',
        card_cvc: '',
    });

    const count = Number(form.data.seats) || 0;
    const location = session.location ?? experience.location;

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post(store.url(session.id), {
            onError: () => form.reset('card_cvc'),
        });
    }

    return (
        <SiteLayout title="Paiement">
            <Head title={`Paiement · ${experience.title}`} />

            <div className="checkout-page">
                <aside className="checkout-summary">
                    <p className="booking-card__type">
                        {experience.type.label}
                    </p>
                    <h1 className="checkout-summary__title">
                        {experience.title}
                    </h1>
                    <p className="booking-card__meta">
                        {formatDateTime(session.starts_at)}
                        {location && (
                            <>
                                <br />
                                {location}
                            </>
                        )}
                    </p>

                    <dl className="checkout-summary__lines">
                        <div>
                            <dt>
                                {count} {count > 1 ? 'places' : 'place'} ×{' '}
                                {formatPrice(session.price)}
                            </dt>
                            <dd>{formatPrice(count * session.price)}</dd>
                        </div>
                        <div className="checkout-summary__total">
                            <dt>Total</dt>
                            <dd>{formatPrice(count * session.price)}</dd>
                        </div>
                    </dl>

                    <Link href={show.url(experience.slug)}>
                        Revenir à l'expérience
                    </Link>
                </aside>

                <form className="account-form" onSubmit={submit}>
                    <h2 className="account-form__title">Paiement par carte</h2>
                    <p className="checkout-notice">
                        Paiement de démonstration : aucune carte n'est débitée
                        et aucune donnée bancaire n'est conservée. Essayez avec
                        4242 4242 4242 4242.
                    </p>

                    <TextField
                        id="seats"
                        label="Nombre de places"
                        type="number"
                        required
                        min={1}
                        max={session.remaining_seats}
                        value={form.data.seats}
                        onChange={(value) => form.setData('seats', value)}
                        error={form.errors.seats}
                    />

                    <TextField
                        id="card_name"
                        label="Titulaire de la carte"
                        required
                        autoComplete="cc-name"
                        value={form.data.card_name}
                        onChange={(value) => form.setData('card_name', value)}
                        error={form.errors.card_name}
                    />

                    <TextField
                        id="card_number"
                        label="Numéro de carte"
                        required
                        inputMode="numeric"
                        placeholder="4242 4242 4242 4242"
                        autoComplete="off"
                        value={form.data.card_number}
                        onChange={(value) => form.setData('card_number', value)}
                        error={form.errors.card_number}
                    />

                    <div className="checkout-row">
                        <TextField
                            id="card_expiry"
                            label="Expiration"
                            required
                            placeholder="MM/AA"
                            autoComplete="off"
                            value={form.data.card_expiry}
                            onChange={(value) =>
                                form.setData('card_expiry', value)
                            }
                            error={form.errors.card_expiry}
                        />

                        <TextField
                            id="card_cvc"
                            label="Cryptogramme"
                            required
                            inputMode="numeric"
                            placeholder="123"
                            autoComplete="off"
                            value={form.data.card_cvc}
                            onChange={(value) =>
                                form.setData('card_cvc', value)
                            }
                            error={form.errors.card_cvc}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        disabled={form.processing || count < 1}
                    >
                        Payer {formatPrice(count * session.price)}
                    </button>
                </form>
            </div>
        </SiteLayout>
    );
}
