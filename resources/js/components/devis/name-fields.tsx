import { useState } from 'react';
import TextField from '@/components/forms/text-field';

type Props = {
    /** Enregistre « Nom Prénom » dans le champ name du formulaire. */
    onNameChange: (name: string) => void;
    nameError?: string;
};

/** Nom et Prénom séparés à l'écran ; le back n'a qu'un champ name. */
export default function NameFields({ onNameChange, nameError }: Props) {
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');

    function updateNom(value: string) {
        setNom(value);
        onNameChange(`${value} ${prenom}`.trim());
    }

    function updatePrenom(value: string) {
        setPrenom(value);
        onNameChange(`${nom} ${value}`.trim());
    }

    return (
        <div className="contact-form__row">
            <TextField
                id="nom"
                label="Nom"
                required
                value={nom}
                onChange={updateNom}
                error={nameError}
            />
            <TextField
                id="prenom"
                label="Prénom"
                required
                value={prenom}
                onChange={updatePrenom}
                error={nameError}
            />
        </div>
    );
}
