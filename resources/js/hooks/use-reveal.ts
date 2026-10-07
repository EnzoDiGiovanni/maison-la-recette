import { useEffect } from 'react';

/**
 * Ajoute `.is-visible` aux éléments `.reveal` quand ils entrent dans
 * le viewport. Le repli affiche tout si IntersectionObserver manque.
 */
export default function useReveal() {
    useEffect(() => {
        const targets = document.querySelectorAll<HTMLElement>('.reveal');

        if (!('IntersectionObserver' in window)) {
            targets.forEach((target) => target.classList.add('is-visible'));

            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                }
            },
            { threshold: 0.15 },
        );

        targets.forEach((target) => observer.observe(target));

        return () => observer.disconnect();
    }, []);
}
