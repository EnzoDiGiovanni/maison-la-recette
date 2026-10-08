import { Head, Link } from '@inertiajs/react';
import SectionTitle from '@/components/section-title';
import StepCard, { type Step } from '@/components/studio/step-card';
import useReveal from '@/hooks/use-reveal';
import SiteLayout from '@/layouts/site-layout';
import quote from '@/routes/contact/quote';

/* Les photos sont à déposer dans public/images/studio/ (step-1.png…). */
const steps: Step[] = [
    {
        title: 'Définition du concept',
        text: 'On travaille ensemble sur le ton, le format, les invités et le calendrier de publication.',
        image: '/images/studio/step-1.png',
    },
    {
        title: 'Enregistrement & montage',
        text: 'Prise de son, montage, mixage et finalisation du fichier audio prêt à diffuser.',
        image: '/images/studio/step-2.png',
    },
    {
        title: 'Publication',
        text: 'Visuels, description, tags et mise en ligne sur les plateformes.',
        image: '/images/studio/step-3.png',
    },
];

export default function Studio() {
    useReveal();

    return (
        <SiteLayout title="Studio">
            <Head title="Studio" />

            <div className="studio-page">
                <section className="studio-intro">
                    <SectionTitle as="h1">De ton idée au podcast</SectionTitle>
                    <p className="studio-intro__text">
                        On prend en charge la création, la production et la
                        diffusion de ton podcast, de la première idée à la mise
                        en ligne.
                    </p>
                </section>

                <section className="studio-timeline">
                    <ol className="studio-timeline__steps">
                        {steps.map((step, index) => (
                            <StepCard
                                key={step.title}
                                number={index + 1}
                                {...step}
                            />
                        ))}
                    </ol>

                    <Link
                        href={quote.podcast.url()}
                        className="btn studio-timeline__cta"
                    >
                        Demander un devis
                    </Link>
                </section>
            </div>
        </SiteLayout>
    );
}
