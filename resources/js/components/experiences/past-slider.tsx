import { useRef } from 'react';
import PhotoDialog from '@/components/experiences/photo-dialog';
import { ArrowDownRightIcon, ChevronRightIcon } from '@/components/icons';
import Cover from '@/components/podcasts/cover';
import { formatDate } from '@/lib/format';
import type { PastEvent } from '@/types';

/** Rangée défilante des dates passées, chacune avec son lien vers les photos. */
export default function PastSlider({ events }: { events: PastEvent[] }) {
    const trackRef = useRef<HTMLUListElement>(null);

    function next() {
        const track = trackRef.current;

        if (!track) {
            return;
        }

        // Arrivé au bout, on revient au début.
        const atEnd =
            track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

        track.scrollTo({
            left: atEnd ? 0 : track.scrollLeft + track.clientWidth / 3,
            behavior: 'smooth',
        });
    }

    return (
        <div className="past-slider">
            <ul className="past-slider__track" ref={trackRef}>
                {events.map((event) => (
                    <li key={event.id} className="past-card">
                        <div className="past-card__panel">
                            <Cover
                                src={event.experience.cover_image_url}
                                className="past-card__photo"
                            />
                            <div className="past-card__body">
                                <h3 className="past-card__title">
                                    {event.experience.title}
                                </h3>
                                <p className="past-card__meta">
                                    Souvenirs du{' '}
                                    {formatDate(event.starts_at.slice(0, 10))}
                                </p>
                            </div>
                        </div>
                        <PhotoDialog
                            experience={event.experience}
                            className="past-card__button"
                        >
                            Voir les photos
                            <ArrowDownRightIcon />
                        </PhotoDialog>
                    </li>
                ))}
            </ul>
            {events.length > 3 && (
                <button
                    type="button"
                    className="past-slider__next"
                    aria-label="Faire défiler les expériences passées"
                    onClick={next}
                >
                    <ChevronRightIcon />
                </button>
            )}
        </div>
    );
}
