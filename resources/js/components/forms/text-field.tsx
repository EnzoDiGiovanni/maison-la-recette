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
    max?: number;
    autoComplete?: string;
    placeholder?: string;
    inputMode?: 'numeric' | 'tel' | 'email';
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
    max,
    autoComplete,
    placeholder,
    inputMode,
}: Props) {
    return (
        <Field id={id} label={label} error={error}>
            <input
                id={id}
                type={type}
                required={required}
                min={min}
                max={max}
                autoComplete={autoComplete}
                placeholder={placeholder}
                inputMode={inputMode}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </Field>
    );
}
