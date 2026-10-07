import InputError from '@/components/forms/input-error';
import type { Option } from '@/types';

type Props = {
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    error?: string;
};

/** Groupe de boutons radio présenté en grille, comme sur la maquette. */
export default function RadioField({
    name,
    label,
    value,
    onChange,
    options,
    error,
}: Props) {
    return (
        <div className="field" role="radiogroup" aria-label={label}>
            <span className="field__label">{label}</span>
            <div className="radio-grid">
                {options.map((option) => (
                    <label key={option.value} className="radio-grid__option">
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                        />
                        {option.label}
                    </label>
                ))}
            </div>
            <InputError message={error} />
        </div>
    );
}
