import type { ReactNode } from 'react';
import InputError from '@/components/forms/input-error';

type Props = {
    id: string;
    label: string;
    error?: string;
    required?: boolean;
    children: ReactNode;
};

export default function Field({ id, label, error, required, children }: Props) {
    return (
        <div className="field">
            <label htmlFor={id}>
                {label}
                {required && (
                    <span className="field__required" aria-hidden>
                        *
                    </span>
                )}
            </label>
            {children}
            <InputError message={error} />
        </div>
    );
}
