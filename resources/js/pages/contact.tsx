import { Head, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import RadioField from '@/components/forms/radio-field';
import SelectField from '@/components/forms/select-field';
import TextField from '@/components/forms/text-field';
import TextareaField from '@/components/forms/textarea-field';
import useReveal from '@/hooks/use-reveal';
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
    useReveal();
    const { settings } = usePage().props;

    // Page réservée aux devis B2B : le choix « Contact » est retiré.
    const quoteTypes = inquiryTypes.filter((type) => type.value !== 'contact');

    const form = useForm({
        type:
            defaultType === 'contact'
                ? (quoteTypes[0]?.value ?? defaultType)
                : defaultType,
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
        <SiteLayout title="Contact">
            <Head title="Contact" />

            <div className="contact-split">
                <div className="contact-split__form">
                    <form className="contact-form" onSubmit={submit}>
                        <RadioField
                            name="type"
                            label="Type de demande"
                            value={form.data.type}
                            onChange={(value) => form.setData('type', value)}
                            options={quoteTypes}
                            error={form.errors.type}
                        />

                        <div className="contact-form__row">
                            <TextField
                                id="name"
                                label="Nom et prénom"
                                required
                                value={form.data.name}
                                onChange={(value) =>
                                    form.setData('name', value)
                                }
                                error={form.errors.name}
                            />

                            {isQuote && (
                                <TextField
                                    id="company"
                                    label="Entreprise ou organisation"
                                    value={form.data.company}
                                    onChange={(value) =>
                                        form.setData('company', value)
                                    }
                                    error={form.errors.company}
                                />
                            )}
                        </div>

                        <TextField
                            id="email"
                            label="E-mail professionnel"
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

                        {isExperienceQuote && (
                            <>
                                <SelectField
                                    id="experience_type"
                                    label="Format d'expérience"
                                    value={form.data.experience_type}
                                    onChange={(value) =>
                                        form.setData('experience_type', value)
                                    }
                                    error={form.errors.experience_type}
                                >
                                    <option value="">
                                        Je ne sais pas encore
                                    </option>
                                    {experienceTypes.map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </option>
                                    ))}
                                </SelectField>

                                <div className="contact-form__row">
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
                                </div>

                                <TextField
                                    id="venue"
                                    label="Lieu souhaité (ou en ligne)"
                                    value={form.data.venue}
                                    onChange={(value) =>
                                        form.setData('venue', value)
                                    }
                                    error={form.errors.venue}
                                />
                            </>
                        )}

                        <TextareaField
                            id="message"
                            label="Votre projet en quelques lignes"
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
                            Envoyer la demande
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

                <section className="contact-visual">
                    <img
                        src="/images/contact-visual.jpg"
                        alt=""
                        className="contact-visual__photo"
                    />
                    <h1 className="contact-visual__title">
                        Décrivez votre projet, on s'occupe du reste.
                    </h1>
                    <p className="contact-visual__intro">
                        Entreprise, collectivité ou association&nbsp;: racontez
                        votre idée de podcast ou d'expérience, nous vous
                        répondons sous 48&nbsp;h.
                    </p>
                </section>
            </div>
        </SiteLayout>
    );
}
