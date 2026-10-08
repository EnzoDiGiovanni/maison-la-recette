import { Head, Link, usePage } from '@inertiajs/react';
import CtaBlock from '@/components/cta-block';
import { ArrowDownRightIcon } from '@/components/icons';
import ProseText from '@/components/prose-text';
import SectionTitle from '@/components/section-title';
import useReveal from '@/hooks/use-reveal';
import SiteLayout from '@/layouts/site-layout';
import { contact } from '@/routes';
import quote from '@/routes/contact/quote';
import { index as experiencesIndex } from '@/routes/experiences';
import { index as podcastsIndex } from '@/routes/podcasts';

const VALUES = ['Authenticité', 'Écoresponsabilité', 'Partage'];

const FACTS = [
    {
        figure: '1/4',
        text: 'de notre empreinte carbone est lié à notre alimentation.',
    },
    {
        figure: '20 tonnes',
        text: 'de nourriture sont jetées chaque minute en France.',
    },
    {
        figure: '1 sur 3',
        text: 'Français·e souffre de maladies chroniques directement liées à son alimentation.',
    },
];

const MISSIONS = [
    {
        verb: 'Inspirer',
        text: 'en créant des rencontres avec des acteur·ices du changement qui cultivent, fabriquent, cuisinent de façon durable.',
    },
    {
        verb: 'Sensibiliser',
        text: 'en racontant leurs histoires et en mettant en lumière leurs initiatives et leurs pratiques.',
    },
    {
        verb: "Donner le pouvoir d'agir",
        text: 'en concevant des expériences concrètes pour explorer les coulisses et solutions de notre alimentation.',
    },
];

export default function About() {
    const { settings } = usePage().props;
    useReveal();

    const fields = [
        {
            title: 'Podcast',
            text: 'Un podcast grand public qui part à la rencontre d’acteur·rices du changement et met en lumière des solutions.',
            label: 'Écouter les épisodes',
            url: podcastsIndex.url(),
        },
        {
            title: 'Studio',
            text: 'Un studio de production de podcasts qui aide les organisations engagées dans l’alimentation durable à faire entendre leur voix.',
            label: 'Demander un devis podcast',
            url: quote.podcast.url(),
        },
        {
            title: 'Expériences',
            text: 'Des ateliers, balades gustatives et immersions qui fédèrent, engagent et sensibilisent à une meilleure alimentation.',
            label: 'Voir les expériences',
            url: experiencesIndex.url(),
        },
    ];

    return (
        <SiteLayout title="À propos">
            <Head title="À propos" />

            <div className="about-page">
                <h1 className="sr-only">À propos de Maison La recette</h1>

                <section className="about-intro">
                    <p className="about-intro__lead">
                        Maison La recette permet d'explorer l'alimentation de
                        demain en podcast et en vrai.
                    </p>
                    <p className="about-intro__text">
                        Et si on changeait le monde en mangeant&nbsp;? Notre
                        conviction&nbsp;: bien manger peut être source de joie.
                    </p>
                    <ul className="about-intro__values">
                        {VALUES.map((value) => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </section>

                <section className="reveal">
                    <SectionTitle>Pourquoi notre assiette compte</SectionTitle>
                    <ul className="about-facts">
                        {FACTS.map((fact) => (
                            <li key={fact.figure}>
                                <strong>{fact.figure}</strong>
                                {fact.text}
                            </li>
                        ))}
                    </ul>
                    <p className="about-page__text">
                        Nourrir, transmettre, créer des liens, préserver sa
                        santé, protéger la planète&nbsp;: notre alimentation
                        nous donne chaque jour le pouvoir d'agir avec sa
                        fourchette.
                    </p>
                </section>

                <section className="about-mission reveal">
                    <p className="about-mission__kicker">Notre mission</p>
                    <h2 className="about-mission__title">
                        Accélérer la transition alimentaire
                    </h2>
                    <ol className="about-mission__list">
                        {MISSIONS.map((mission) => (
                            <li key={mission.verb}>
                                <strong>{mission.verb}</strong>
                                {mission.text}
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="reveal">
                    <SectionTitle>Trois champs d'action</SectionTitle>
                    <ul className="about-fields">
                        {fields.map((field) => (
                            <li key={field.title}>
                                <h3>{field.title}</h3>
                                <p>{field.text}</p>
                                <Link href={field.url}>
                                    {field.label}
                                    <ArrowDownRightIcon />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="about-founder reveal">
                    {settings.about_photo_url ? (
                        <img
                            src={settings.about_photo_url}
                            alt="La fondatrice de Maison La recette"
                            className="about-founder__photo"
                        />
                    ) : (
                        <span className="about-founder__photo" aria-hidden />
                    )}
                    <div className="about-founder__body">
                        <h2 className="about-founder__title">
                            Derrière le micro
                        </h2>
                        <ProseText text={settings.about_text} />
                    </div>
                </section>

                <CtaBlock
                    title={<>Envie d'en parler&nbsp;?</>}
                    href={contact.url()}
                    label="Nous contacter"
                >
                    Un projet de podcast, une expérience pour votre équipe ou
                    une simple question&nbsp;: nous vous répondons sous
                    48&nbsp;h.
                </CtaBlock>
            </div>
        </SiteLayout>
    );
}
