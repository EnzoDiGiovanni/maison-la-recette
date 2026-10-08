import { Head, Link, usePage } from '@inertiajs/react';
import HomeBanner from '@/components/home-banner';
import HomeHero from '@/components/home-hero';
import SiteHeader from '@/components/site-header';
import { contact, dashboard, home, login, studio } from '@/routes';
import { index as experiencesIndex } from '@/routes/experiences';
import { index as podcastsIndex } from '@/routes/podcasts';
import projetImg from '../../images/projet.png';
import aboutImg from '../../images/about.png';

export default function Home() {
    const { flash, props } = usePage();
    const { settings, auth } = props;

    const footerLinks = [
        {
            label: 'Mon compte',
            url: auth.user ? dashboard.url() : login.url(),
        },
        { label: 'Contact', url: contact.url() },
        { label: 'Accueil', url: home.url() },
        { label: 'Studio', url: studio.url() },
        { label: 'Podcast', url: podcastsIndex.url() },
        { label: 'Expériences', url: experiencesIndex.url() },
    ];

    return (
        <>
            <Head title="Accueil" />

            {flash.success && <p role="status">{flash.success}</p>}

            <main className="home-page" id="top">
                <HomeBanner />

                <SiteHeader title="Maison La recette" isHome />

                <HomeHero />

                <a
                    href="#projet"
                    className="scroll-arrow"
                    aria-label="Descendre vers le projet"
                />

                {/* =====================================================
                LE PROJET
            ===================================================== */}

                <section className="split-section project-section" id="projet">
                    <div className="split-media">
                        <div className="split-image-wrap">
                            <img
                                src={projetImg}
                                alt=""
                                className="split-image"
                            />
                        </div>
                    </div>

                    <div className="split-content">
                        <h2>LE PROJET</h2>
                        <h3>
                            Cuisiner mieux,
                            <span>ensemble.</span>
                        </h3>
                        <p>
                            Maison La Recette est née d'une conviction simple :
                            bien manger ne doit être ni un luxe ni une
                            contrainte. Le projet réunit un studio de création
                            de podcasts, un podcast et des événements pour
                            rendre la cuisine durable, joyeuse et accessible à
                            tous·tes.
                        </p>
                        <p>
                            Un quart de notre empreinte carbone se joue dans
                            notre assiette. Alors on met les bons ingrédients en
                            bocal : des rencontres, des recettes et des gestes à
                            reproduire chez toi. La Recette te fait découvrir
                            celles et ceux qui changent l'alimentation, pour que
                            tu puisses, toi aussi, passer à table et à l'action.
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
                À PROPOS DE MOI
            ===================================================== */}

                <section className="split-section about-section" id="about">
                    <div className="split-content">
                        <h2>À PROPOS DE MOI</h2>
                        <h3>
                            Du journalisme,
                            <span>à la production.</span>
                        </h3>
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

                    <div className="split-media">
                        <div className="split-image-wrap">
                            <img
                                src={aboutImg}
                                alt="Julie Van Ossel"
                                className="split-image"
                            />
                        </div>
                    </div>
                </section>

                {/* =====================================================
                CARTE CONTACT
            ===================================================== */}

                <section className="contact-card" id="contact">
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
                </section>

                {/* =====================================================
                PIED DE PAGE
            ===================================================== */}

                <footer className="home-footer">
                    <div className="home-footer-brand">
                        <span>Maison La Recette</span>
                        {settings.contact_email && (
                            <a href={`mailto:${settings.contact_email}`}>
                                {settings.contact_email}
                            </a>
                        )}
                    </div>

                    <nav aria-label="Pied de page">
                        {footerLinks.map((link) => (
                            <Link key={link.label} href={link.url}>
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </footer>

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
