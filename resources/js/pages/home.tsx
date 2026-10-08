import { Head, Link, usePage } from '@inertiajs/react';
import { contact } from '@/routes';
import { index as experiencesIndex } from '@/routes/experiences';
import { index as podcastsIndex } from '@/routes/podcasts';
import logoImg from '../../images/logo.png';
import projetImg from '../../images/projet.png';
import aboutImg from '../../images/about.png';
import podcastImg from '../../images/podcast.png';
import studioImg from '../../images/studio.png';
import podcastHoverImg from '../../images/podcast-hover.png';
import experiencesImg from '../../images/experiences.png';

const STUDIO_PATH =
    'M185 108 C188 140 200 170 222 200 C240 225 258 260 266 290 C270 310 262 325 266 340 C268 346 264 350 258 350 C240 352 222 348 205 335 C185 318 165 295 140 272 C115 250 85 225 62 200 C40 175 18 160 8 140 C4 130 8 118 15 110 C22 100 30 96 35 95 C45 93 52 92 55 90 C58 82 60 76 66 70 C74 62 90 58 105 58 C115 57 122 54 130 54 C138 54 142 58 145 62 C150 70 155 76 160 80 C170 90 178 100 185 108 Z';

const PODCAST_PATH =
    'M195 30 C200 20 205 15 215 14 C228 13 236 12 245 11 C258 10 270 8 280 6 C292 4 300 8 310 10 C322 12 334 12 340 18 C346 26 347 45 348 60 C348 72 348 85 348 95 C335 120 322 160 312 200 C302 240 292 280 288 310 C285 325 286 335 290 342 C282 350 268 352 258 350 C264 350 268 346 266 340 C262 325 270 310 266 290 C258 260 240 225 222 200 C200 170 188 140 185 108 C183 85 186 50 195 30 Z';

const EXPERIENCES_PATH =
    'M348 95 C335 120 322 160 312 200 C302 240 292 280 288 310 C285 325 286 335 290 342 C296 346 312 350 330 348 C345 347 352 346 360 340 C372 330 392 315 405 300 C415 290 418 272 425 262 C432 248 440 238 452 228 C468 214 485 200 498 185 C510 170 520 150 528 125 C535 110 542 95 540 85 C538 72 530 68 515 68 C505 68 500 72 490 72 C480 72 472 66 460 63 C445 58 425 50 410 48 C395 45 380 46 370 52 C360 60 352 78 348 95 Z';

export default function Home() {
    const { flash, props } = usePage();
    const { settings } = props;

    return (
        <>
            <Head title="Accueil" />

            {flash.success && <p role="status">{flash.success}</p>}

            <main className="home-page" id="top">
                {/* =====================================================
                HEADER : LOGO | TITRE | ICÔNES + MENU
            ===================================================== */}

                <header className="home-header">
                    {/* LOGO */}
                    <a
                        href="#top"
                        className="home-logo"
                        aria-label="Maison La Recette, accueil"
                    >
                        <img src={logoImg} alt="Maison La Recette" />
                    </a>

                    {/* TITRE */}
                    <h1 className="home-title">MAISON LA RECETTE</h1>

                    {/* ICÔNES */}
                    <div className="social-icons">
                        {settings.link_linkedin && (
                            <a
                                href={settings.link_linkedin}
                                aria-label="LinkedIn"
                                className="linkedin-icon"
                            >
                                <svg viewBox="0 0 24 24">
                                    <path d="M6.5 8.3H3.3V20h3.2V8.3ZM4.9 3C3.85 3 3 3.85 3 4.9s.85 1.9 1.9 1.9 1.9-.85 1.9-1.9S5.95 3 4.9 3ZM20.7 13.3c0-3.52-1.88-5.16-4.39-5.16-2.02 0-2.92 1.11-3.42 1.89V8.3H9.7V20h3.19v-5.79c0-1.53.29-3.01 2.18-3.01 1.86 0 1.89 1.75 1.89 3.11V20H20.7v-6.7Z" />
                                </svg>
                            </a>
                        )}

                        {settings.link_instagram && (
                            <a
                                href={settings.link_instagram}
                                aria-label="Instagram"
                            >
                                <svg viewBox="0 0 24 24">
                                    <rect
                                        x="3.5"
                                        y="3.5"
                                        width="17"
                                        height="17"
                                        rx="4.5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <circle
                                        cx="17.5"
                                        cy="6.7"
                                        r="1.1"
                                        fill="currentColor"
                                    />
                                </svg>
                            </a>
                        )}

                        {settings.link_ausha && (
                            <a href={settings.link_ausha} aria-label="Podcast">
                                <svg viewBox="0 0 24 24">
                                    <rect
                                        x="9"
                                        y="3"
                                        width="6"
                                        height="11"
                                        rx="3"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />
                                    <path
                                        d="M6.5 11.5a5.5 5.5 0 0 0 11 0"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M12 17v4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M9 21h6"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </a>
                        )}
                    </div>

                    {/* MENU */}
                    <nav className="home-nav">
                        <a href="#about">À PROPOS DE MOI</a>
                        <a href="#projet">LE PROJET</a>
                        <a href="#contact">ME CONTACTER</a>
                    </nav>
                </header>

                {/* =====================================================
                HERO : FORMES AVEC PHOTO AU SURVOL
            ===================================================== */}

                <section className="home-artwork">
                    <svg
                        className="organic-shapes"
                        viewBox="-6 -4 556 362"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <filter
                                id="hand-drawn"
                                x="-5%"
                                y="-5%"
                                width="110%"
                                height="110%"
                            >
                                <feTurbulence
                                    type="fractalNoise"
                                    baseFrequency="0.03"
                                    numOctaves="2"
                                    seed="7"
                                    result="noise"
                                />
                                <feDisplacementMap
                                    in="SourceGraphic"
                                    in2="noise"
                                    scale="3"
                                    xChannelSelector="R"
                                    yChannelSelector="G"
                                />
                            </filter>

                            <clipPath id="clip-studio">
                                <path d={STUDIO_PATH} />
                            </clipPath>

                            <clipPath id="clip-podcast">
                                <path d={PODCAST_PATH} />
                            </clipPath>

                            <clipPath id="clip-experiences">
                                <path d={EXPERIENCES_PATH} />
                            </clipPath>
                        </defs>

                        {/* STUDIO : pas encore de page dédiée sur dev */}
                        <a href="#" className="shape-group">
                            <g filter="url(#hand-drawn)">
                                <path className="shape-fill" d={STUDIO_PATH} />
                                <image
                                    href={studioImg}
                                    className="shape-image"
                                    x="-50"
                                    y="10"
                                    width="375"
                                    height="385"
                                    preserveAspectRatio="xMidYMid slice"
                                    clipPath="url(#clip-studio)"
                                />
                                <path
                                    className="organic-line"
                                    d={STUDIO_PATH}
                                />
                            </g>
                            <text className="shape-text" x="108" y="150">
                                STUDIO
                            </text>
                        </a>

                        {/* PODCAST */}
                        <Link
                            href={podcastsIndex.url()}
                            className="shape-group"
                        >
                            <g filter="url(#hand-drawn)">
                                <path className="shape-fill" d={PODCAST_PATH} />
                                <image
                                    href={podcastHoverImg}
                                    className="shape-image"
                                    x="150"
                                    y="-30"
                                    width="232"
                                    height="416"
                                    preserveAspectRatio="xMidYMid slice"
                                    clipPath="url(#clip-podcast)"
                                />
                                <path
                                    className="organic-line"
                                    d={PODCAST_PATH}
                                />
                            </g>
                            <text className="shape-text" x="267" y="103">
                                PODCAST
                            </text>
                        </Link>

                        {/* EXPÉRIENCES */}
                        <Link
                            href={experiencesIndex.url()}
                            className="shape-group"
                        >
                            <g filter="url(#hand-drawn)">
                                <path
                                    className="shape-fill"
                                    d={EXPERIENCES_PATH}
                                />
                                <image
                                    href={experiencesImg}
                                    className="shape-image"
                                    x="240"
                                    y="10"
                                    width="346"
                                    height="376"
                                    preserveAspectRatio="xMidYMid slice"
                                    clipPath="url(#clip-experiences)"
                                />
                                <path
                                    className="organic-line"
                                    d={EXPERIENCES_PATH}
                                />
                            </g>
                            <text className="shape-text" x="430" y="145">
                                EXPÉRIENCES
                            </text>
                        </Link>
                    </svg>
                </section>

                <a
                    href="#projet"
                    className="scroll-arrow"
                    aria-label="Descendre vers le projet"
                />

                {/* =====================================================
                LE PROJET
            ===================================================== */}

                <section className="split-section project-section" id="projet">
                    <div className="split-image-wrap">
                        <img src={projetImg} alt="" className="split-image" />
                    </div>

                    <div className="split-content">
                        <h2>LE PROJET</h2>
                        <p>
                            aucibus ex sapien vitae pellentesque sem placerat.
                            In id cursus mi pretium tellus duis convallis.
                            Tempus leo eu aenean sed diam urna tempor. Pulvinar
                            vivamus fringilla lacus nec metus bibendum egestas.
                        </p>
                    </div>
                </section>

                {/* =====================================================
                VALEURS
            ===================================================== */}

                <section className="values-section">
                    <span>INSPIRER</span>
                    <i />
                    <span>SENSIBILISER</span>
                    <i />
                    <span>AGIR</span>
                </section>

                {/* =====================================================
                CITATION
            ===================================================== */}

                <section className="quote-section">
                    <p>Mieux manger, pour sauver la planète.</p>
                </section>

                {/* =====================================================
                À PROPOS DE MOI + CARTE CONTACT
            ===================================================== */}

                <section className="about-section" id="about">
                    <div className="split-image-wrap about-photo">
                        <img src={aboutImg} alt="" className="split-image" />
                    </div>

                    <div className="about-text">
                        <h2>À PROPOS DE MOI</h2>
                        <p>
                            Hello ! Je suis Julie Van Ossel, journaliste, et
                            l'alimentation, c'est mon sujet depuis 15 ans ! J'ai
                            réalisé des reportages pour Arte, France TV, M6 et
                            Euronews, puis j'ai décidé de mettre le micro dans
                            le plat. Depuis 2023, je produis et j'anime La
                            Recette, le podcast qui part chaque mois à la
                            rencontre d'artisan·es, de chefs et de producteurs
                            qui façonnent l'alimentation de demain. Et
                            maintenant, on passe à table : avec Maison La
                            Recette !
                        </p>
                    </div>

                    <div className="split-image-wrap about-photo">
                        <img src={podcastImg} alt="" className="split-image" />
                    </div>

                    <div className="contact-card" id="contact">
                        <h3>
                            Une question ?
                            <br />
                            Contacte-moi !
                        </h3>
                        <p>
                            Je serai ravie de répondre à vos questions,
                            <br />
                            dans les meilleurs délais.
                        </p>
                        <Link href={contact.url()} className="contact-button">
                            Formulaire de contact
                        </Link>
                    </div>
                </section>

                {/* =====================================================
                RETOUR EN HAUT
            ===================================================== */}

                <a
                    href="#top"
                    className="back-to-top"
                    aria-label="Revenir en haut"
                >
                    <svg viewBox="0 0 24 24">
                        <path
                            d="M7 14l5-5 5 5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </a>
            </main>
        </>
    );
}
