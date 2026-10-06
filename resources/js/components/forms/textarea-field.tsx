import Field from '@/components/forms/field';

type Props = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    rows?: number;
};

export default function TextareaField({
    id,
    label,
    value,
    onChange,
    error,
    required,
    rows = 6,
}: Props) {
    return (
        <Field id={id} label={label} error={error}>
            <textarea
                id={id}
                required={required}
                rows={rows}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </Field>
    );
}
