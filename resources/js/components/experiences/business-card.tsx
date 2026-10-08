import { Link } from '@inertiajs/react';
import quote from '@/routes/contact/quote';

/** Encart jaune du menu expériences : l'offre sur mesure pour les équipes. */
export default function BusinessCard() {
    return (
        <section className="business-card">
            <h2 className="business-card__title">Pour les entreprises</h2>
            <p>
                Organisons ensemble votre <strong>team-building</strong>.
            </p>
            <p>L'expérience permet de&nbsp;:</p>
            <ul className="business-card__list">
                <li>Souder les équipes</li>
                <li>Renforcer le travail en coopération</li>
                <li>Sensibiliser à un mode de vie durable et écoresponsable</li>
            </ul>
            <Link href={quote.experience.url()} className="btn btn--light">
                Demander un devis
            </Link>
        </section>
    );
}
