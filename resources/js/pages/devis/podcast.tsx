import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import NameFields from '@/components/devis/name-fields';
import QuoteLayout from '@/components/devis/quote-layout';
import TextField from '@/components/forms/text-field';
import TextareaField from '@/components/forms/textarea-field';
import { store } from '@/routes/contact';

/** Devis « Podcast pour entreprises » : le type est fixé, aucun autre formulaire accessible ici. */
export default function PodcastQuote() {
    const form = useForm({
        type: 'devis_podcast',
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
    });

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post(store.url(), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <QuoteLayout
            subtitle="Podcast pour entreprises"
            processing={form.processing}
            onSubmit={submit}
        >
            <NameFields
                onNameChange={(name) => form.setData('name', name)}
                nameError={form.errors.name}
            />

            <TextField
                id="company"
                label="Raison sociale"
                value={form.data.company}
                onChange={(value) => form.setData('company', value)}
                error={form.errors.company}
            />

            <div className="contact-form__row">
                <TextField
                    id="phone"
                    label="Numéro de téléphone"
                    type="tel"
                    value={form.data.phone}
                    onChange={(value) => form.setData('phone', value)}
                    error={form.errors.phone}
                />
                <TextField
                    id="email"
                    label="Mail"
                    type="email"
                    required
                    value={form.data.email}
                    onChange={(value) => form.setData('email', value)}
                    error={form.errors.email}
                />
            </div>

            <TextareaField
                id="message"
                label="Projet en quelques lignes"
                required
                rows={4}
                value={form.data.message}
                onChange={(value) => form.setData('message', value)}
                error={form.errors.message}
            />
        </QuoteLayout>
    );
}
