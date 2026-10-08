import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import Field from '@/components/forms/field';
import TextField from '@/components/forms/text-field';
import SiteLayout from '@/layouts/site-layout';
import { formatDay, formatHour, formatPrice } from '@/lib/format';
import { store } from '@/routes/bookings';
import { show } from '@/routes/sessions';
import type { Experience, ExperienceSession } from '@/types';

type Props = {
    experience: Experience;
    session: ExperienceSession;
    /** Nombre de places choisi à l'étape de réservation. */
    seats: number;
};

/** Chiffres seuls, coupés à la longueur d'un champ de carte. */
function digits(value: string, length: number): string {
    return value.replace(/\D/g, '').slice(0, length);
}

/** Numéro déjà précédé d'un indicatif : « +32… », « 0033… ». */
function hasDialCode(phone: string): boolean {
    return /^\s*(\+|00)/.test(phone);
}

/** Paiement de démonstration : rien n'est débité ni conservé. */
export default function BookingsCheckout({
    experience,
    session,
    seats,
}: Props) {
    const { user } = usePage().props.auth;
    // Le compte n'a qu'un champ nom : le premier mot fait le prénom.
    const [firstName = '', ...lastName] = (user?.name ?? '').split(' ');

    const form = useForm({
        seats: String(seats),
        first_name: firstName,
        last_name: lastName.join(' '),
        email: user?.email ?? '',
        // L'indicatif +33 est affiché devant un numéro français.
        phone: (user?.phone ?? '').replace(/^\+33\s*/, ''),
        payment_method: 'card',
        card_name: user?.name ?? '',
        card_number: '',
        card_expiry: '',
        card_cvc: '',
    });

    const total = formatPrice(seats * session.price);
    const location = session.location ?? experience.location;
    const byCard = form.data.payment_method === 'card';

    function submit(event: FormEvent) {
        event.preventDefault();

        form.transform((data) => ({
            ...data,
            // Un numéro saisi avec son indicatif est gardé tel quel.
            phone:
                data.phone.trim() === '' || hasDialCode(data.phone)
                    ? data.phone.trim()
                    : `+33 ${data.phone.trim().replace(/^0/, '')}`,
        }));
        form.post(store.url(session.id), {
            onError: () => form.reset('card_cvc'),
        });
    }

    return (
        <SiteLayout title="Expériences" subtitle="Paiement">
            <Head title={`Paiement · ${experience.title}`} />

            <div className="checkout-page">
                <aside className="checkout-summary">
                    <h1 className="checkout-summary__title">
                        {experience.title}
                    </h1>
                    <p className="checkout-summary__date">
                        <time dateTime={session.starts_at}>
                            {formatDay(session.starts_at)}
                        </time>{' '}
                        à {formatHour(session.starts_at)}
                    </p>
                    {location && (
                        <p className="checkout-summary__place">{location}</p>
                    )}

                    <dl className="checkout-summary__lines">
                        <div>
                            <dt>
                                {seats} {seats > 1 ? 'places' : 'place'} ×{' '}
                                {formatPrice(session.price)}
                            </dt>
                            <dd>{total}</dd>
                        </div>
                        <div className="checkout-summary__total">
                            <dt>Total</dt>
                            <dd>{total}</dd>
                        </div>
                    </dl>

                    <Link href={show.url(session.id)}>
                        Revenir à la réservation
                    </Link>
                </aside>

                <form className="checkout-form" onSubmit={submit}>
                    <h2 className="checkout-form__title">
                        Information de contact
                    </h2>

                    <div className="checkout-form__row">
                        <TextField
                            id="first_name"
                            label="Prénom"
                            required
                            autoComplete="given-name"
                            placeholder="Julien"
                            value={form.data.first_name}
                            onChange={(value) =>
                                form.setData('first_name', value)
                            }
                            error={form.errors.first_name}
                        />
                        <TextField
                            id="last_name"
                            label="Nom"
                            required
                            autoComplete="family-name"
                            placeholder="Brossolette"
                            value={form.data.last_name}
                            onChange={(value) =>
                                form.setData('last_name', value)
                            }
                            error={form.errors.last_name}
                        />
                    </div>

                    <TextField
                        id="email"
                        label="Adresse mail"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="julien.brossolette@mail.com"
                        value={form.data.email}
                        onChange={(value) => form.setData('email', value)}
                        error={form.errors.email}
                    />

                    <Field
                        id="phone"
                        label="Téléphone"
                        error={form.errors.phone}
                    >
                        <div className="checkout-form__phone">
                            {!hasDialCode(form.data.phone) && (
                                <span aria-hidden>+33</span>
                            )}
                            <input
                                id="phone"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel-national"
                                placeholder="6 12 34 56 78"
                                value={form.data.phone}
                                onChange={(event) =>
                                    form.setData('phone', event.target.value)
                                }
                            />
                        </div>
                    </Field>

                    <fieldset className="checkout-form__methods">
                        <legend className="checkout-form__title">
                            Choisir un mode de paiement
                        </legend>
                        {[
                            { value: 'paypal', label: 'PayPal' },
                            { value: 'card', label: 'Carte de crédit' },
                        ].map((method) => (
                            <label key={method.value}>
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value={method.value}
                                    checked={
                                        form.data.payment_method ===
                                        method.value
                                    }
                                    onChange={() =>
                                        form.setData(
                                            'payment_method',
                                            method.value,
                                        )
                                    }
                                />
                                {method.label}
                            </label>
                        ))}
                    </fieldset>

                    {byCard && (
                        <>
                            <TextField
                                id="card_name"
                                label="Titulaire de la carte"
                                required
                                autoComplete="cc-name"
                                placeholder="Julien Brossolette"
                                value={form.data.card_name}
                                onChange={(value) =>
                                    form.setData('card_name', value)
                                }
                                error={form.errors.card_name}
                            />

                            <TextField
                                id="card_number"
                                label="Numéro de carte"
                                required
                                inputMode="numeric"
                                placeholder="4242 4242 4242 4242"
                                autoComplete="off"
                                maxLength={19}
                                value={form.data.card_number}
                                // 16 chiffres au plus, par groupes de quatre.
                                onChange={(value) =>
                                    form.setData(
                                        'card_number',
                                        digits(value, 16).replace(
                                            /(\d{4})(?=\d)/g,
                                            '$1 ',
                                        ),
                                    )
                                }
                                error={form.errors.card_number}
                            />

                            <div className="checkout-form__row checkout-form__row--short">
                                <TextField
                                    id="card_cvc"
                                    label="CVC"
                                    required
                                    inputMode="numeric"
                                    placeholder="123"
                                    autoComplete="off"
                                    maxLength={3}
                                    value={form.data.card_cvc}
                                    onChange={(value) =>
                                        form.setData(
                                            'card_cvc',
                                            digits(value, 3),
                                        )
                                    }
                                    error={form.errors.card_cvc}
                                />

                                <TextField
                                    id="card_expiry"
                                    label="Expiration"
                                    required
                                    inputMode="numeric"
                                    placeholder="MM/AA"
                                    autoComplete="off"
                                    maxLength={5}
                                    value={form.data.card_expiry}
                                    // Quatre chiffres, la barre s'ajoute seule.
                                    onChange={(value) =>
                                        form.setData(
                                            'card_expiry',
                                            digits(value, 4).replace(
                                                /(\d{2})(?=\d)/,
                                                '$1/',
                                            ),
                                        )
                                    }
                                    error={form.errors.card_expiry}
                                />
                            </div>
                        </>
                    )}

                    {form.errors.seats && (
                        <p role="alert">{form.errors.seats}</p>
                    )}

                    <button
                        type="submit"
                        className="btn"
                        disabled={form.processing}
                    >
                        Payer · {total}
                    </button>

                    <p className="checkout-form__notice">
                        Paiement de démonstration&nbsp;: rien n'est débité et
                        aucune donnée bancaire n'est conservée.
                        {byCard && ' Essayez avec 4242 4242 4242 4242.'}
                    </p>
                </form>
            </div>
        </SiteLayout>
    );
}
