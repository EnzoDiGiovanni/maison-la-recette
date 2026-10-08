import { createInertiaApp } from '@inertiajs/react';
import { initSiteLoader } from '@/lib/site-loader';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    // L'écran au logo animé remplace la barre de progression.
    progress: false,
}).then(initSiteLoader);
