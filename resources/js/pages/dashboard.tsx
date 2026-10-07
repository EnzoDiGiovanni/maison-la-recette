import { Head, Link } from '@inertiajs/react';
import BookingCard from '@/components/account/booking-card';
import InquiryCard from '@/components/account/inquiry-card';
import PasswordForm from '@/components/account/password-form';
import ProfileForm from '@/components/account/profile-form';
import PodcastTile from '@/components/podcasts/podcast-tile';
import StatusPill from '@/components/account/status-pill';
import CtaBlock from '@/components/cta-block';
import SectionTitle from '@/components/section-title';
import SiteLayout from '@/layouts/site-layout';
import { formatDate, formatPrice } from '@/lib/format';
import { contact, logout } from '@/routes';
import { index as experiencesIndex } from '@/routes/experiences';
import { index as podcastsIndex } from '@/routes/podcasts';
import type { Account, Booking, Inquiry, Podcast } from '@/types';

type Props = {
    account: Account;
    /** Épisodes mis de côté, le dernier ajouté en premier. */
    favoritePodcasts: Podcast[];
    /** Réservations du compte, de la plus lointaine à la plus ancienne. */
    bookings: Booking[];
    /** Demandes envoyées depuis le compte, la plus récente en premier. */
    inquiries: Inquiry[];
};

// Damier : jaune/saumon puis saumon/jaune, comme les sorties du podcast.
const tone = (position: number) =>
    (position + Math.floor(position / 2)) % 2 === 0 ? 'jaune' : 'saumon';

export default function Dashboard({
    account,
    favoritePodcasts,
    bookings,
    inquiries,
}: Props) {
    const isCompany = account.type.value === 'entreprise';
    const firstName = account.name.split(' ')[0];

    const live = (booking: Booking) =>
        booking.is_upcoming &&
        ['pending', 'paid'].includes(booking.status.value);
    // Les prochaines d'abord : la plus proche en tête.
    const upcoming = bookings.filter(live).reverse();
    const history = bookings.filter((booking) => !live(booking));

    return (
        <SiteLayout title="Mon compte">
            <Head title="Mon compte" />

            <div className="account-page">
                <section className="account-hero">
                    <div>
                        <p className="account-chip">
                            Compte {account.type.label.toLowerCase()}
                        </p>
                        <h1 className="account-hero__hello">
                            Bonjour {firstName},
                        </h1>
                        <p className="account-hero__meta">
                            {isCompany && account.company
                                ? `${account.company} · `
                                : ''}
                            {account.email}
                            {account.member_since &&
                                ` · à table avec nous depuis le ${formatDate(account.member_since)}`}
                        </p>
                    </div>
                    <div className="account-hero__actions">
                        {/* Le back-office est hors Inertia : lien classique. */}
                        {account.admin_url && (
                            <a href={account.admin_url} className="btn">
                                Back-office
                            </a>
                        )}
                        <Link
                            href={logout.url()}
                            method="post"
                            as="button"
                            className="btn btn--ghost"
                        >
                            Se déconnecter
                        </Link>
                    </div>
                </section>

                {account.can_book_online && (
                    <section>
                        <SectionTitle>Mes prochaines expériences</SectionTitle>
                        {upcoming.length === 0 ? (
                            <p className="account-empty">
                                Rien au menu pour l'instant. Atelier ou balade
                                gustative : choisissez votre prochaine date.
                            </p>
                        ) : (
                            <ul className="booking-grid">
                                {upcoming.map((booking, position) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        tone={tone(position)}
                                    />
                                ))}
                            </ul>
                        )}
                    </section>
                )}

                {(isCompany || inquiries.length > 0) && (
                    <section>
                        <SectionTitle>
                            {isCompany
                                ? 'Mes demandes de devis'
                                : 'Mes demandes'}
                        </SectionTitle>
                        {inquiries.length === 0 ? (
                            <p className="account-empty">
                                Aucune demande pour l'instant. Parlez-nous de
                                votre projet : nous vous répondons sous 48 h.
                            </p>
                        ) : (
                            <ul className="booking-grid">
                                {inquiries.map((inquiry, position) => (
                                    <InquiryCard
                                        key={inquiry.id}
                                        inquiry={inquiry}
                                        tone={tone(position)}
                                    />
                                ))}
                            </ul>
                        )}
                    </section>
                )}

                {isCompany ? (
                    <CtaBlock
                        title={<>Un projet pour votre équipe&nbsp;?</>}
                        href={contact.url({
                            query: { type: 'devis_experience' },
                        })}
                        label="Demander un devis"
                    >
                        Atelier, good tour ou immersion : date, lieu et nombre
                        de participant·es s'adaptent à votre événement, sur
                        devis.
                    </CtaBlock>
                ) : (
                    <CtaBlock
                        title={<>Une petite faim de découverte&nbsp;?</>}
                        href={experiencesIndex.url()}
                        label="Voir les expériences"
                    >
                        Ateliers et good tours à Lyon, aux côtés de chef·fes et
                        d'artisan·es engagé·es.
                    </CtaBlock>
                )}

                <section>
                    <SectionTitle>À écouter plus tard</SectionTitle>
                    {favoritePodcasts.length === 0 ? (
                        <p className="account-empty">
                            Votre salade de podcast est encore vide. Gardez un
                            épisode de côté avec le marque-page.{' '}
                            <Link href={podcastsIndex.url()}>
                                Parcourir les épisodes
                            </Link>
                        </p>
                    ) : (
                        <ul className="podcast-row">
                            {favoritePodcasts.map((podcast) => (
                                <PodcastTile
                                    key={podcast.id}
                                    podcast={podcast}
                                />
                            ))}
                        </ul>
                    )}
                </section>

                {history.length > 0 && (
                    <section>
                        <SectionTitle>Mon historique</SectionTitle>
                        <ul className="account-list">
                            {history.map((booking) => (
                                <li key={booking.id}>
                                    <time dateTime={booking.session.starts_at}>
                                        {formatDate(
                                            booking.session.starts_at.slice(
                                                0,
                                                10,
                                            ),
                                        )}
                                    </time>
                                    <span className="account-list__title">
                                        {booking.experience.title}
                                    </span>
                                    <span>
                                        {booking.seats}{' '}
                                        {booking.seats > 1 ? 'places' : 'place'}{' '}
                                        · {formatPrice(booking.amount)}
                                    </span>
                                    <StatusPill status={booking.status} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section>
                    <SectionTitle>Mes informations</SectionTitle>
                    <div className="account-forms">
                        <ProfileForm account={account} />
                        <PasswordForm />
                    </div>
                </section>
            </div>
        </SiteLayout>
    );
}
