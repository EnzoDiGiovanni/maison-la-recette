import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import TextField from '@/components/forms/text-field';
import { update } from '@/routes/dashboard/password';

export default function PasswordForm() {
    const form = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function submit(event: FormEvent) {
        event.preventDefault();

        form.put(update.url(), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <form className="account-form" onSubmit={submit}>
            <h3 className="account-form__title">Mon mot de passe</h3>

            <TextField
                id="current_password"
                label="Mot de passe actuel"
                type="password"
                required
                autoComplete="current-password"
                value={form.data.current_password}
                onChange={(value) => form.setData('current_password', value)}
                error={form.errors.current_password}
            />

            <TextField
                id="password"
                label="Nouveau mot de passe"
                type="password"
                required
                autoComplete="new-password"
                value={form.data.password}
                onChange={(value) => form.setData('password', value)}
                error={form.errors.password}
            />

            <TextField
                id="password_confirmation"
                label="Confirmation"
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
                className="btn btn--ghost"
                disabled={form.processing}
            >
                Modifier
            </button>
        </form>
    );
}
