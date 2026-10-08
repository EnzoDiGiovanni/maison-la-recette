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
import { logout } from '@/routes';
import quote from '@/routes/contact/quote';
import { index as experiencesIndex } from '@/routes/experiences';
import { index as podcastsIndex } from '@/routes/podcasts';
import type { Account, Booking, Inquiry, Podcast } from '@/types';

type Props = {
    account: Account;
    /** Épisodes mis de côté, le dernier ajouté en premier. */
    favoritePodcasts: Podcast[];
    /** Épisodes à découvrir, hors liste d'écoute. */
    suggestedPodcasts: Podcast[];
    /** Réservations du compte, de la plus lointaine à la plus ancienne. */
    bookings: Booking[];
    /** Demandes envoyées depuis le compte, la plus récente en premier. */
    inquiries: Inquiry[];
};

// Damier : jaune/saumon puis saumon/jaune, en alternance.
const tone = (position: number) =>
    (position + Math.floor(position / 2)) % 2 === 0 ? 'jaune' : 'saumon';

export default function Dashboard({
    account,
    favoritePodcasts,
    suggestedPodcasts,
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
        <SiteLayout title="Mon compte" subtitle={`Bonjour, ${firstName}`}>
            <Head title="Mon compte" />

            <div className="account-page">
                <h1 className="sr-only">Mon compte</h1>

                {/* Sur la ligne du « Bonjour » de l'en-tête, à droite. */}
                <p className="account-top">
                    {/* Le back-office est hors Inertia : lien classique. */}
                    {account.admin_url && (
                        <a href={account.admin_url}>Back-office</a>
                    )}
                    <Link href={logout.url()} method="post" as="button">
                        Se déconnecter
                    </Link>
                </p>

                {account.can_book_online && (
                    <section>
                        <SectionTitle>Mes prochaines expériences</SectionTitle>
                        {upcoming.length === 0 && (
                            <p className="account-empty">
                                Rien au menu pour l'instant. Atelier ou balade
                                gustative : choisissez votre prochaine date.
                            </p>
                        )}
                        <ul className="account-upcoming">
                            {upcoming.map((booking, position) => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    tone={tone(position)}
                                />
                            ))}
                            <li className="account-discover">
                                <p>Une petite faim de découverte&nbsp;?</p>
                                <Link
                                    href={experiencesIndex.url()}
                                    className="btn btn--light"
                                >
                                    Voir les expériences
                                </Link>
                            </li>
                        </ul>
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

                {isCompany && (
                    <CtaBlock
                        title={<>Un projet pour votre équipe&nbsp;?</>}
                        href={quote.experience.url()}
                        label="Demander un devis"
                    >
                        Atelier, good tour ou immersion : date, lieu et nombre
                        de participant·es s'adaptent à votre événement, sur
                        devis.
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
                                    favoriteIcon="heart"
                                />
                            ))}
                        </ul>
                    )}
                </section>

                {suggestedPodcasts.length > 0 && (
                    <section>
                        <SectionTitle>Suggestion</SectionTitle>
                        <ul className="podcast-row">
                            {suggestedPodcasts.map((podcast) => (
                                <PodcastTile
                                    key={podcast.id}
                                    podcast={podcast}
                                    favoriteIcon="heart"
                                />
                            ))}
                        </ul>
                    </section>
                )}

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
