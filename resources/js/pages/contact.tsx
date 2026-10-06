import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
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
    const form = useForm({
        type: defaultType,
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
        <SiteLayout>
            <Head title="Contact" />

            <h1>Contact et demande de devis</h1>

            <form onSubmit={submit}>
                <div>
                    <label htmlFor="type">Votre demande</label>
                    <select
                        id="type"
                        value={form.data.type}
                        onChange={(event) =>
                            form.setData('type', event.target.value)
                        }
                    >
                        {inquiryTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    {form.errors.type && <p role="alert">{form.errors.type}</p>}
                </div>

                <div>
                    <label htmlFor="name">Nom</label>
                    <input
                        id="name"
                        required
                        value={form.data.name}
                        onChange={(event) =>
                            form.setData('name', event.target.value)
                        }
                    />
                    {form.errors.name && <p role="alert">{form.errors.name}</p>}
                </div>

                <div>
                    <label htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={form.data.email}
                        onChange={(event) =>
                            form.setData('email', event.target.value)
                        }
                    />
                    {form.errors.email && (
                        <p role="alert">{form.errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="phone">Téléphone</label>
                    <input
                        id="phone"
                        type="tel"
                        value={form.data.phone}
                        onChange={(event) =>
                            form.setData('phone', event.target.value)
                        }
                    />
                    {form.errors.phone && (
                        <p role="alert">{form.errors.phone}</p>
                    )}
                </div>

                {isQuote && (
                    <div>
                        <label htmlFor="company">Structure</label>
                        <input
                            id="company"
                            value={form.data.company}
                            onChange={(event) =>
                                form.setData('company', event.target.value)
                            }
                        />
                        {form.errors.company && (
                            <p role="alert">{form.errors.company}</p>
                        )}
                    </div>
                )}

                {isExperienceQuote && (
                    <>
                        <div>
                            <label htmlFor="experience_type">
                                Format souhaité
                            </label>
                            <select
                                id="experience_type"
                                value={form.data.experience_type}
                                onChange={(event) =>
                                    form.setData(
                                        'experience_type',
                                        event.target.value,
                                    )
                                }
                            >
                                <option value="">Je ne sais pas encore</option>
                                {experienceTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            {form.errors.experience_type && (
                                <p role="alert">
                                    {form.errors.experience_type}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="participants">
                                Nombre de participant·es
                            </label>
                            <input
                                id="participants"
                                type="number"
                                min={1}
                                value={form.data.participants}
                                onChange={(event) =>
                                    form.setData(
                                        'participants',
                                        event.target.value,
                                    )
                                }
                            />
                            {form.errors.participants && (
                                <p role="alert">{form.errors.participants}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="desired_date">Date souhaitée</label>
                            <input
                                id="desired_date"
                                type="date"
                                value={form.data.desired_date}
                                onChange={(event) =>
                                    form.setData(
                                        'desired_date',
                                        event.target.value,
                                    )
                                }
                            />
                            {form.errors.desired_date && (
                                <p role="alert">{form.errors.desired_date}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="venue">Lieu souhaité</label>
                            <input
                                id="venue"
                                value={form.data.venue}
                                onChange={(event) =>
                                    form.setData('venue', event.target.value)
                                }
                            />
                            {form.errors.venue && (
                                <p role="alert">{form.errors.venue}</p>
                            )}
                        </div>
                    </>
                )}

                <div>
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        required
                        rows={6}
                        value={form.data.message}
                        onChange={(event) =>
                            form.setData('message', event.target.value)
                        }
                    />
                    {form.errors.message && (
                        <p role="alert">{form.errors.message}</p>
                    )}
                </div>

                <button type="submit" disabled={form.processing}>
                    Envoyer
                </button>
            </form>
        </SiteLayout>
    );
}
