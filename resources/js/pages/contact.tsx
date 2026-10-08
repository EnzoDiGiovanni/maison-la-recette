import { Head, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import TextField from '@/components/forms/text-field';
import TextareaField from '@/components/forms/textarea-field';
import useReveal from '@/hooks/use-reveal';
import SiteLayout from '@/layouts/site-layout';
import { store } from '@/routes/contact';

export default function Contact() {
    useReveal();
    const { settings } = usePage().props;

    const form = useForm({
        type: 'contact',
        name: '',
        email: '',
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
        <SiteLayout title="Contact">
            <Head title="Contact" />

            <div className="contact-simple reveal">
                <h1 className="contact-split__title">Contact</h1>
                <p className="contact-simple__intro">
                    Une question, une idée, un projet&nbsp;? Écrivez-nous, nous
                    vous répondons sous 48&nbsp;h.
                </p>

                <form className="contact-form" onSubmit={submit}>
                    <TextField
                        id="name"
                        label="Nom"
                        required
                        value={form.data.name}
                        onChange={(value) => form.setData('name', value)}
                        error={form.errors.name}
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

                    <TextareaField
                        id="message"
                        label="Votre message"
                        required
                        rows={5}
                        value={form.data.message}
                        onChange={(value) => form.setData('message', value)}
                        error={form.errors.message}
                    />

                    <button
                        type="submit"
                        className="contact-form__submit"
                        disabled={form.processing}
                    >
                        Envoyer le message
                    </button>

                    {settings.contact_email && (
                        <p className="contact-form__alt">
                            Vous préférez l'e-mail&nbsp;?{' '}
                            <a href={`mailto:${settings.contact_email}`}>
                                {settings.contact_email}
                            </a>
                        </p>
                    )}
                </form>
            </div>
        </SiteLayout>
    );
}
