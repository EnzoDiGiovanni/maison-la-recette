import type { Testimonial } from '@/types';

/** Témoignages en liste : prénom et étoiles rouges, fonction, puis l'avis. */
export default function ReviewList({
    testimonials,
}: {
    testimonials: Testimonial[];
}) {
    return (
        <ul className="review-list">
            {testimonials.map((testimonial) => (
                <li key={testimonial.id} className="review">
                    <div className="review__head">
                        <p className="review__author">
                            {testimonial.author_name}
                        </p>
                        <p
                            className="review__stars"
                            role="img"
                            aria-label={`Note : ${testimonial.rating} sur 5`}
                        >
                            {'★'.repeat(testimonial.rating)}
                        </p>
                    </div>
                    {(testimonial.author_role ||
                        testimonial.experience_title) && (
                        <p className="review__role">
                            {[
                                testimonial.author_role,
                                testimonial.experience_title,
                            ]
                                .filter(Boolean)
                                .join(' · ')}
                        </p>
                    )}
                    <blockquote className="review__quote">
                        {testimonial.quote}
                    </blockquote>
                </li>
            ))}
        </ul>
    );
}
