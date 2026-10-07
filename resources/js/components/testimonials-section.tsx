import TestimonialCard from '@/components/testimonial-card';
import type { Testimonial } from '@/types';

export default function TestimonialsSection({
    testimonials,
    title = 'Avis de nos client·es',
}: {
    testimonials: Testimonial[];
    title?: string;
}) {
    return (
        <section>
            <h2>{title}</h2>
            <ul>
                {testimonials.map((testimonial) => (
                    <TestimonialCard
                        key={testimonial.id}
                        testimonial={testimonial}
                    />
                ))}
            </ul>
        </section>
    );
}
