import { Head } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';
import useReveal from '@/hooks/use-reveal';
import SiteLayout from '@/layouts/site-layout';

type Props = {
    /** Sous-titre sous « Demande de devis », ex. « Expériences entreprises ». */
    subtitle: string;
    processing: boolean;
    onSubmit: (event: FormEvent) => void;
    children: ReactNode;
};

/** Mise en page commune aux devis : formulaire à gauche, photo à droite. */
export default function QuoteLayout({
    subtitle,
    processing,
    onSubmit,
    children,
}: Props) {
    useReveal();

    return (
        <SiteLayout title="Contact">
            <Head title={`Demande de devis – ${subtitle}`} />

            <div className="contact-split">
                <div className="contact-split__form reveal">
                    <h1 className="contact-split__title">Demande de devis</h1>
                    <p className="contact-split__subtitle">{subtitle}</p>

                    <form className="contact-form" onSubmit={onSubmit}>
                        {children}

                        <button
                            type="submit"
                            className="contact-form__submit"
                            disabled={processing}
                        >
                            Envoyer le formulaire
                        </button>
                    </form>
                </div>

                <section className="contact-visual" aria-hidden>
                    <img
                        src="/images/contact-visual.jpg"
                        alt=""
                        className="contact-visual__photo"
                    />
                </section>
            </div>
        </SiteLayout>
    );
}
