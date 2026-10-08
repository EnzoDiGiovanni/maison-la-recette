import { router } from '@inertiajs/react';

/** Filet de sécurité : l'intro se ferme seule si la vidéo ne se termine pas. */
const INTRO_TIMEOUT_MS = 6000;
/** En dessous de ce délai, un changement de page ne montre pas l'écran. */
const NAVIGATION_DELAY_MS = 300;

/**
 * Écran de chargement au logo animé (le calque est dans app.blade.php) :
 * visible à l'arrivée sur le site, puis à chaque changement de page un peu long.
 */
export function initSiteLoader(): void {
    const loader = document.getElementById('site-loader');

    if (!loader) {
        return;
    }

    const video = loader.querySelector('video');

    const hide = () => {
        loader.classList.add('site-loader--hidden');
        video?.pause();
    };

    const show = () => {
        // Sans source (animations réduites), l'image fixe reste affichée.
        if (video?.src) {
            video.currentTime = 0;
            void video.play().catch(() => {});
        }

        loader.classList.remove('site-loader--hidden');
    };

    // Première page de la session : l'animation du logo est jouée en entier.
    let seen = false;

    try {
        seen = sessionStorage.getItem('site-loader-seen') === '1';
        sessionStorage.setItem('site-loader-seen', '1');
    } catch {
        // Stockage indisponible (navigation privée) : on joue l'intro.
    }

    if (seen || !video?.src) {
        hide();
    } else {
        // Une seule lecture, jusqu'au bout ; la boucle reprend pour la suite.
        const endIntro = () => {
            window.clearTimeout(fallback);
            video.removeEventListener('ended', endIntro);
            video.removeEventListener('error', endIntro);
            video.loop = true;
            hide();
        };
        const fallback = window.setTimeout(endIntro, INTRO_TIMEOUT_MS);

        video.loop = false;
        video.addEventListener('ended', endIntro);
        // Vidéo illisible ou lecture automatique refusée : on ne retient pas
        // le visiteur devant un écran figé.
        video.addEventListener('error', endIntro);

        if (video.error) {
            endIntro();
        } else if (video.paused) {
            video.play().catch(endIntro);
        }
    }

    let timer: number | undefined;

    router.on('start', (event) => {
        const { visit } = event.detail;

        // Seuls les changements de page : un formulaire envoyé, un favori
        // ou un rechargement partiel ne doivent pas masquer l'écran.
        const changesPage =
            visit.method === 'get' &&
            !visit.async &&
            !visit.prefetch &&
            visit.only.length === 0 &&
            visit.url.pathname !== window.location.pathname;

        window.clearTimeout(timer);

        if (changesPage) {
            timer = window.setTimeout(show, NAVIGATION_DELAY_MS);
        }
    });

    router.on('finish', () => {
        window.clearTimeout(timer);
        hide();
    });
}
