import type { ReactNode } from 'react';
import Field from '@/components/forms/field';

type Props = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    /** Les éléments <option> du select. */
    children: ReactNode;
};

export default function SelectField({
    id,
    label,
    value,
    onChange,
    error,
    children,
}: Props) {
    return (
        <Field id={id} label={label} error={error}>
            <select
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            >
                {children}
            </select>
        </Field>
    );
}
