import StatusPill from '@/components/account/status-pill';
import { formatDate } from '@/lib/format';
import type { Inquiry } from '@/types';

type Props = {
    inquiry: Inquiry;
    tone: 'jaune' | 'saumon';
};

/** Demande de devis ou message envoyé depuis le compte, avec son suivi. */
export default function InquiryCard({ inquiry, tone }: Props) {
    return (
        <li className={`inquiry-card inquiry-card--${tone}`}>
            <div className="inquiry-card__head">
                <p className="booking-card__type">{inquiry.type.label}</p>
                <StatusPill status={inquiry.status} />
            </div>

            <h3 className="booking-card__title">
                {inquiry.experience_type ?? inquiry.type.label}
                {inquiry.participants &&
                    ` pour ${inquiry.participants} personnes`}
            </h3>

            {(inquiry.desired_date || inquiry.venue) && (
                <p className="booking-card__meta">
                    {inquiry.desired_date &&
                        `Souhaité le ${formatDate(inquiry.desired_date)}`}
                    {inquiry.desired_date && inquiry.venue && <br />}
                    {inquiry.venue}
                </p>
            )}

            <p className="inquiry-card__message">{inquiry.message}</p>

            {inquiry.created_at && (
                <p className="inquiry-card__sent">
                    Envoyée le {formatDate(inquiry.created_at.slice(0, 10))}
                </p>
            )}
        </li>
    );
}
