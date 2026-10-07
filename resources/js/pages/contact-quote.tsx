import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import SelectField from '@/components/forms/select-field';
import TextField from '@/components/forms/text-field';
import TextareaField from '@/components/forms/textarea-field';
import useReveal from '@/hooks/use-reveal';
import SiteLayout from '@/layouts/site-layout';
import { store } from '@/routes/contact';
import type { Option } from '@/types';

type Props = {
    /** Type de devis demandé, fixé par la route (/devis-experience ou /devis-podcast). */
    type: 'devis_experience' | 'devis_podcast';
    defaultExperienceType: string | null;
    experienceTypes: Option[];
};

export default function ContactQuote({
    type,
    defaultExperienceType,
    experienceTypes,
}: Props) {
    useReveal();

    const isExperienceQuote = type === 'devis_experience';

    const form = useForm({
        type,
        name: '',
        email: '',
        phone: '',
        company: '',
        experience_type: defaultExperienceType ?? '',
        participants: '',
        desired_date: '',
        venue: '',
        message: '',
    });

    // La maquette sépare Nom et Prénom ; le back enregistre un seul champ name.
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');

    function updatePrenom(value: string) {
        setPrenom(value);
        form.setData('name', `${nom} ${value}`.trim());
    }

    function updateNom(value: string) {
        setNom(value);
        form.setData('name', `${value} ${prenom}`.trim());
    }

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post(store.url(), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <SiteLayout title="Contact">
            <Head title="Demande de devis" />

            <div className="contact-split">
                <div className="contact-split__form reveal">
                    <h1 className="contact-split__title">Demande de devis</h1>
                    <p className="contact-split__subtitle">
                        {isExperienceQuote
                            ? 'Expériences entreprises'
                            : 'Podcast pour entreprises'}
                    </p>

                    <form className="contact-form" onSubmit={submit}>
                        {isExperienceQuote && (
                            <SelectField
                                id="experience_type"
                                label="Format d'expérience"
                                value={form.data.experience_type}
                                onChange={(value) =>
                                    form.setData('experience_type', value)
                                }
                                error={form.errors.experience_type}
                            >
                                <option value="">Je ne sais pas encore</option>
                                {experienceTypes.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </SelectField>
                        )}

                        <div className="contact-form__row">
                            <TextField
                                id="nom"
                                label="Nom"
                                required
                                value={nom}
                                onChange={updateNom}
                                error={form.errors.name}
                            />
                            <TextField
                                id="prenom"
                                label="Prénom"
                                required
                                value={prenom}
                                onChange={updatePrenom}
                                error={form.errors.name}
                            />
                        </div>

                        <div className="contact-form__row">
                            <TextField
                                id="company"
                                label="Raison sociale"
                                value={form.data.company}
                                onChange={(value) =>
                                    form.setData('company', value)
                                }
                                error={form.errors.company}
                            />
                            {isExperienceQuote && (
                                <TextField
                                    id="participants"
                                    label="Nombre de participants"
                                    type="number"
                                    min={1}
                                    value={form.data.participants}
                                    onChange={(value) =>
                                        form.setData('participants', value)
                                    }
                                    error={form.errors.participants}
                                />
                            )}
                        </div>

                        <div className="contact-form__row">
                            <TextField
                                id="phone"
                                label="Numéro de téléphone"
                                type="tel"
                                value={form.data.phone}
                                onChange={(value) =>
                                    form.setData('phone', value)
                                }
                                error={form.errors.phone}
                            />
                            <TextField
                                id="email"
                                label="Mail"
                                type="email"
                                required
                                value={form.data.email}
                                onChange={(value) =>
                                    form.setData('email', value)
                                }
                                error={form.errors.email}
                            />
                        </div>

                        <TextareaField
                            id="message"
                            label="Projet en quelques lignes"
                            required
                            rows={4}
                            value={form.data.message}
                            onChange={(value) =>
                                form.setData('message', value)
                            }
                            error={form.errors.message}
                        />

                        <button
                            type="submit"
                            className="contact-form__submit"
                            disabled={form.processing}
                        >
                            Envoyer le formulaire
                        </button>
                    </form>
                </div>

                <section className="contact-visual" aria-hidden>
                    <img
                        src="/images/contact-visual.jpg"
                        alt=""
                        className="contact-visual__photo"
                    />
                </section>
            </div>
        </SiteLayout>
    );
}
