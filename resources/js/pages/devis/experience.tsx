import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import NameFields from '@/components/devis/name-fields';
import QuoteLayout from '@/components/devis/quote-layout';
import SelectField from '@/components/forms/select-field';
import TextField from '@/components/forms/text-field';
import TextareaField from '@/components/forms/textarea-field';
import { store } from '@/routes/contact';
import type { Option } from '@/types';

type Props = {
    /** Format pré-sélectionné depuis une fiche expérience (?experience_type=). */
    defaultExperienceType: string | null;
    experienceTypes: Option[];
};

/** Devis « Expériences entreprises » : le type est fixé, aucun autre formulaire accessible ici. */
export default function ExperienceQuote({
    defaultExperienceType,
    experienceTypes,
}: Props) {
    const form = useForm({
        type: 'devis_experience',
        name: '',
        email: '',
        phone: '',
        company: '',
        experience_type: defaultExperienceType ?? '',
        participants: '',
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
            subtitle="Expériences entreprises"
            processing={form.processing}
            onSubmit={submit}
        >
            <SelectField
                id="experience_type"
                label="Format d'expérience"
                value={form.data.experience_type}
                onChange={(value) => form.setData('experience_type', value)}
                error={form.errors.experience_type}
            >
                <option value="">Je ne sais pas encore</option>
                {experienceTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </SelectField>

            <NameFields
                onNameChange={(name) => form.setData('name', name)}
                nameError={form.errors.name}
            />

            <div className="contact-form__row">
                <TextField
                    id="company"
                    label="Raison sociale"
                    value={form.data.company}
                    onChange={(value) => form.setData('company', value)}
                    error={form.errors.company}
                />
                <TextField
                    id="participants"
                    label="Nombre de participants"
                    type="number"
                    min={1}
                    value={form.data.participants}
                    onChange={(value) => form.setData('participants', value)}
                    error={form.errors.participants}
                />
            </div>

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
