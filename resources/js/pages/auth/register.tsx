import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import InputError from '@/components/forms/input-error';
import TextField from '@/components/forms/text-field';
import SiteLayout from '@/layouts/site-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';
import type { Option } from '@/types';

type Props = {
    /** Types de compte ouverts à l'inscription : particulier, entreprise. */
    accountTypes: Option[];
};

const hints: Record<string, string> = {
    particulier: 'Je réserve mes ateliers et good tours en ligne.',
    entreprise: 'Je demande un devis sur mesure pour mon équipe.',
};

export default function Register({ accountTypes }: Props) {
    const form = useForm({
        account_type: accountTypes[0]?.value ?? 'particulier',
        name: '',
        email: '',
        phone: '',
        company: '',
        password: '',
        password_confirmation: '',
    });

    const isCompany = form.data.account_type === 'entreprise';

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post(store.url(), {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    }

    return (
        <SiteLayout title="Mon compte">
            <Head title="Créer un compte" />

            <div className="auth-page">
                <form className="account-form auth-card" onSubmit={submit}>
                    <h1 className="auth-card__title">Mettez-vous à table</h1>
                    <p className="auth-card__intro">
                        Un compte pour suivre vos expériences Maison La recette.
                    </p>

                    <fieldset className="type-choice">
                        <legend>Vous êtes</legend>
                        {accountTypes.map((type) => (
                            <label
                                key={type.value}
                                className={`type-choice__tile type-choice__tile--${type.value}`}
                            >
                                <input
                                    type="radio"
                                    name="account_type"
                                    value={type.value}
                                    checked={
                                        form.data.account_type === type.value
                                    }
                                    onChange={() =>
                                        form.setData('account_type', type.value)
                                    }
                                />
                                <strong>{type.label}</strong>
                                <span>{hints[type.value]}</span>
                            </label>
                        ))}
                        <InputError message={form.errors.account_type} />
                    </fieldset>

                    <TextField
                        id="name"
                        label="Nom"
                        required
                        autoComplete="name"
                        value={form.data.name}
                        onChange={(value) => form.setData('name', value)}
                        error={form.errors.name}
                    />

                    {isCompany && (
                        <TextField
                            id="company"
                            label="Structure"
                            required
                            autoComplete="organization"
                            value={form.data.company}
                            onChange={(value) => form.setData('company', value)}
                            error={form.errors.company}
                        />
                    )}

                    <TextField
                        id="email"
                        label="E-mail"
                        type="email"
                        required
                        autoComplete="email"
                        value={form.data.email}
                        onChange={(value) => form.setData('email', value)}
                        error={form.errors.email}
                    />

                    <TextField
                        id="phone"
                        label="Téléphone"
                        type="tel"
                        autoComplete="tel"
                        value={form.data.phone}
                        onChange={(value) => form.setData('phone', value)}
                        error={form.errors.phone}
                    />

                    <TextField
                        id="password"
                        label="Mot de passe"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={form.data.password}
                        onChange={(value) => form.setData('password', value)}
                        error={form.errors.password}
                    />

                    <TextField
                        id="password_confirmation"
                        label="Confirmation du mot de passe"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={form.data.password_confirmation}
                        onChange={(value) =>
                            form.setData('password_confirmation', value)
                        }
                    />

                    <button
                        type="submit"
                        className="btn"
                        disabled={form.processing}
                    >
                        Créer mon compte
                    </button>

                    <p className="auth-card__switch">
                        Déjà un compte ?{' '}
                        <Link href={login.url()}>Se connecter</Link>
                    </p>
                </form>
            </div>
        </SiteLayout>
    );
}
