import { Head, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import SelectField from '@/components/forms/select-field';
import TextField from '@/components/forms/text-field';
import TextareaField from '@/components/forms/textarea-field';
import SiteLayout from '@/layouts/site-layout';
import { store } from '@/routes/contact';
import type { Option } from '@/types';

type Props = {
    /** Type présélectionné, repris du paramètre ?type= de l'URL. */
    defaultType: string;
    defaultExperienceType: string | null;
    inquiryTypes: Option[];
    experienceTypes: Option[];
};

export default function Contact({
    defaultType,
    defaultExperienceType,
    inquiryTypes,
    experienceTypes,
}: Props) {
    // Connecté·e : les coordonnées du compte pré-remplissent le formulaire.
    const { user } = usePage().props.auth;

    const form = useForm({
        type: defaultType,
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        company: user?.company ?? '',
        experience_type: defaultExperienceType ?? '',
        participants: '',
        desired_date: '',
        venue: '',
        message: '',
    });

    const isExperienceQuote = form.data.type === 'devis_experience';
    const isQuote = form.data.type !== 'contact';

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post(store.url(), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <SiteLayout>
            <Head title="Contact" />

            <h1>Contact et demande de devis</h1>

            <form onSubmit={submit}>
                <SelectField
                    id="type"
                    label="Votre demande"
                    value={form.data.type}
                    onChange={(value) => form.setData('type', value)}
                    error={form.errors.type}
                >
                    {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </SelectField>

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
                    label="E-mail"
                    type="email"
                    required
                    value={form.data.email}
                    onChange={(value) => form.setData('email', value)}
                    error={form.errors.email}
                />

                <TextField
                    id="phone"
                    label="Téléphone"
                    type="tel"
                    value={form.data.phone}
                    onChange={(value) => form.setData('phone', value)}
                    error={form.errors.phone}
                />

                {isQuote && (
                    <TextField
                        id="company"
                        label="Structure"
                        value={form.data.company}
                        onChange={(value) => form.setData('company', value)}
                        error={form.errors.company}
                    />
                )}

                {isExperienceQuote && (
                    <>
                        <SelectField
                            id="experience_type"
                            label="Format souhaité"
                            value={form.data.experience_type}
                            onChange={(value) =>
                                form.setData('experience_type', value)
                            }
                            error={form.errors.experience_type}
                        >
                            <option value="">Je ne sais pas encore</option>
                            {experienceTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </SelectField>

                        <TextField
                            id="participants"
                            label="Nombre de participant·es"
                            type="number"
                            min={1}
                            value={form.data.participants}
                            onChange={(value) =>
                                form.setData('participants', value)
                            }
                            error={form.errors.participants}
                        />

                        <TextField
                            id="desired_date"
                            label="Date souhaitée"
                            type="date"
                            value={form.data.desired_date}
                            onChange={(value) =>
                                form.setData('desired_date', value)
                            }
                            error={form.errors.desired_date}
                        />

                        <TextField
                            id="venue"
                            label="Lieu souhaité"
                            value={form.data.venue}
                            onChange={(value) => form.setData('venue', value)}
                            error={form.errors.venue}
                        />
                    </>
                )}

                <TextareaField
                    id="message"
                    label="Message"
                    required
                    rows={6}
                    value={form.data.message}
                    onChange={(value) => form.setData('message', value)}
                    error={form.errors.message}
                />

                <button type="submit" disabled={form.processing}>
                    Envoyer
                </button>
            </form>
        </SiteLayout>
    );
}
