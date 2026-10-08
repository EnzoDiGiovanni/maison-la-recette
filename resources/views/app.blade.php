<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        {{-- Écran de chargement : stylé ici pour s'afficher avant l'arrivée de la feuille de style. --}}
        <style>
            .site-loader {
                position: fixed;
                inset: 0;
                z-index: 1000;
                display: grid;
                place-items: center;
                background: var(--accent-color, #fffdf7);
                transition: opacity 0.4s ease, visibility 0s 0.4s;
            }

            .site-loader video {
                width: min(45vw, 11rem);
                height: auto;
            }

            .site-loader--hidden {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
            }
        </style>

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        {{-- Logo animé affiché au chargement du site puis entre les pages (resources/js/lib/site-loader.ts). --}}
        <div id="site-loader" class="site-loader" aria-hidden="true">
            <video loop muted playsinline poster="/images/loader.png" width="360" height="360"></video>
        </div>
        <script>
            (function () {
                var video = document.querySelector('#site-loader video');

                // Animations réduites : on garde l'image fixe du logo.
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    return;
                }

                // La transparence passe par HEVC sur Safari et sur tout iOS (Chrome, Edge
                // et Firefox y tournent sur WebKit), par WebM ailleurs.
                var ua = navigator.userAgent;
                var isIOS = /iP(hone|ad|od)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
                var isSafari = /safari/i.test(ua) && !/chrome|chromium|android|edg\//i.test(ua);
                var isWebKit = isIOS || isSafari;

                video.src = isWebKit ? '/videos/loader.mov' : '/videos/loader.webm';
                video.play().catch(function () {});
            })();
        </script>
        <x-inertia::app />
    </body>
</html>
