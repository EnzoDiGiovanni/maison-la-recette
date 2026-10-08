import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import TextField from '@/components/forms/text-field';
import { update } from '@/routes/dashboard/profile';
import type { Account } from '@/types';

export default function ProfileForm({ account }: { account: Account }) {
    const isCompany = account.type.value === 'entreprise';

    const form = useForm({
        name: account.name,
        email: account.email,
        phone: account.phone ?? '',
        company: account.company ?? '',
    });

    function submit(event: FormEvent) {
        event.preventDefault();

        form.put(update.url(), { preserveScroll: true });
    }

    return (
        <form className="account-form" onSubmit={submit}>
            <h3 className="account-form__title">Mes coordonnées</h3>

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

            <button type="submit" className="btn" disabled={form.processing}>
                Enregistrer
            </button>
        </form>
    );
}
