import type { Auth } from '@/types/auth';
import type { Settings } from '@/types/models';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            settings: Settings;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
        flashDataType: {
            success?: string;
        };
    }
}
