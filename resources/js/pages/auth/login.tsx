import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import TextField from '@/components/forms/text-field';
import SiteLayout from '@/layouts/site-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';

export default function Login() {
    const form = useForm({ email: '', password: '', remember: false });

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post(store.url(), { onFinish: () => form.reset('password') });
    }

    return (
        <SiteLayout title="Mon compte">
            <Head title="Connexion" />

            <div className="auth-page">
                <form className="account-form auth-card" onSubmit={submit}>
                    <h1 className="auth-card__title">Content de vous revoir</h1>
                    <p className="auth-card__intro">
                        Retrouvez vos réservations et vos demandes de devis.
                    </p>

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
                        id="password"
                        label="Mot de passe"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={form.data.password}
                        onChange={(value) => form.setData('password', value)}
                        error={form.errors.password}
                    />

                    <label className="auth-card__check">
                        <input
                            type="checkbox"
                            checked={form.data.remember}
                            onChange={(event) =>
                                form.setData('remember', event.target.checked)
                            }
                        />
                        Rester connecté·e
                    </label>

                    <button
                        type="submit"
                        className="btn"
                        disabled={form.processing}
                    >
                        Se connecter
                    </button>

                    <p className="auth-card__switch">
                        Pas encore de compte ?{' '}
                        <Link href={register.url()}>Créer un compte</Link>
                    </p>
                </form>
            </div>
        </SiteLayout>
    );
}
