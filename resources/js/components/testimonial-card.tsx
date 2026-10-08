import type { Testimonial } from '@/types';

export default function TestimonialCard({
    testimonial,
}: {
    testimonial: Testimonial;
}) {
    return (
        <li>
            <blockquote>{testimonial.quote}</blockquote>
            <p>
                {testimonial.author_name}
                {testimonial.author_role && `, ${testimonial.author_role}`}
            </p>
        </li>
    );
}
