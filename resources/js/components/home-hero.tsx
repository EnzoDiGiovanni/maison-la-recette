import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { studio } from '@/routes';
import { index as experiencesIndex } from '@/routes/experiences';
import { index as podcastsIndex } from '@/routes/podcasts';

/** Nombre de formes qui tombent dans chaque bocal (positions dans hero.css). */
const SHAPES = 15;

/** Délai entre deux bocaux quand ils se remplissent tout seuls. */
const AUTO_FILL_STAGGER = 450;

const JARS = [
    {
        key: 'studio',
        href: studio.url(),
        label: 'STUDIO',
        lines: ['On crée ton podcast,', 'de l’idée à la mise en ligne.'],
        cta: 'Découvrir le studio',
    },
    {
        key: 'podcast',
        href: podcastsIndex.url(),
        label: 'PODCAST',
        lines: ['Celles et ceux qui', 'changent l’alimentation.'],
        cta: 'Écouter les épisodes',
    },
    {
        key: 'experiences',
        href: experiencesIndex.url(),
        label: 'EXPÉRIENCES',
        lines: ['Ateliers, dégustations', 'et team-building.'],
        cta: 'Voir l’agenda',
    },
];

/**
 * Hero de l'accueil : trois bocaux (Studio, Podcast, Expériences) qui se remplissent au
 * survol ou au focus clavier. Sur écran tactile, ils se remplissent l'un après l'autre
 * quand la section entre dans l'écran ; si l'utilisateur a demandé à réduire les
 * mouvements, ils sont remplis d'emblée, sans animation.
 */
export default function HomeHero() {
    const jarsRef = useRef<HTMLUListElement>(null);
    const [openCount, setOpenCount] = useState(0);

    useEffect(() => {
        const jars = jarsRef.current;

        if (!jars) {
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setOpenCount(JARS.length);

            return;
        }

        if (
            !window.matchMedia('(hover: none)').matches ||
            !('IntersectionObserver' in window)
        ) {
            return;
        }

        const timers: number[] = [];

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) {
                    return;
                }

                JARS.forEach((_, index) => {
                    timers.push(
                        window.setTimeout(
                            () => setOpenCount(index + 1),
                            index * AUTO_FILL_STAGGER,
                        ),
                    );
                });

                observer.disconnect();
            },
            { threshold: 0.35 },
        );

        observer.observe(jars);

        return () => {
            observer.disconnect();
            timers.forEach((timer) => window.clearTimeout(timer));
        };
    }, []);

    return (
        <section className="mlr-hero" aria-label="Nos trois activités">
            <ul className="mlr-jars" ref={jarsRef}>
                {JARS.map((jar, index) => (
                    <li key={jar.key}>
                        <Link
                            href={jar.href}
                            className={`mlr-jar mlr-jar--${jar.key}${index < openCount ? ' is-open' : ''}`}
                        >
                            <div className="mlr-lid" aria-hidden="true" />
                            <div className="mlr-neck" aria-hidden="true" />
                            <div className="mlr-body">
                                <div className="mlr-pile" aria-hidden="true">
                                    {Array.from(
                                        { length: SHAPES },
                                        (_, shape) => (
                                            <span key={shape} />
                                        ),
                                    )}
                                </div>
                                <span className="mlr-label">{jar.label}</span>
                                <span className="mlr-chip mlr-chip--l1">
                                    {jar.lines[0]}
                                </span>
                                <span className="mlr-chip mlr-chip--l2">
                                    {jar.lines[1]}
                                </span>
                                <span className="mlr-chip mlr-cta">
                                    {jar.cta}
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.4"
                                        strokeLinecap="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M5 12h14M13 6l6 6-6 6" />
                                    </svg>
                                </span>
                            </div>
                            <div className="mlr-shadow" aria-hidden="true" />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
