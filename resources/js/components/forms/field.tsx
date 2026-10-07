import type { ReactNode } from 'react';
import InputError from '@/components/forms/input-error';

type Props = {
    id: string;
    label: string;
    error?: string;
    children: ReactNode;
};

export default function Field({ id, label, error, children }: Props) {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            {children}
            <InputError message={error} />
        </div>
    );
}
