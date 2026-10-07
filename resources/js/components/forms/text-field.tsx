import type { HTMLInputTypeAttribute } from 'react';
import Field from '@/components/forms/field';

type Props = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: HTMLInputTypeAttribute;
    required?: boolean;
    min?: number;
};

export default function TextField({
    id,
    label,
    value,
    onChange,
    error,
    type = 'text',
    required,
    min,
}: Props) {
    return (
        <Field id={id} label={label} error={error}>
            <input
                id={id}
                type={type}
                required={required}
                min={min}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </Field>
    );
}
