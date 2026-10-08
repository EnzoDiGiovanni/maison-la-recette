import { useState } from 'react';

export type Step = {
    title: string;
    text: string;
    /** Photo illustrant l'étape ; un aplat vert prend le relais sinon. */
    image?: string | null;
};

type Props = Step & {
    /** Numéro affiché au-dessus du titre (« Étape 1 »). */
    number: number;
};

/** Une étape de la frise Studio : photo encadrée à gauche, titre souligné à droite. */
export default function StepCard({ number, title, text, image }: Props) {
    // Fichier absent de public/images/studio : on retombe sur l'aplat vert.
    const [missing, setMissing] = useState(false);

    return (
        <li className="step-card reveal">
            {image && !missing ? (
                <img
                    src={image}
                    alt=""
                    loading="lazy"
                    className="step-card__photo"
                    onError={() => setMissing(true)}
                />
            ) : (
                <span className="step-card__photo" aria-hidden />
            )}

            <div className="step-card__body">
                <p className="step-card__number">Étape {number}</p>
                <h2 className="step-card__title">{title}</h2>
                <p className="step-card__text">{text}</p>
            </div>
        </li>
    );
}
