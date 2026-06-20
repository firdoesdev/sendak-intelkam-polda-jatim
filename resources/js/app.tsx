import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import {Toaster} from '@/components/ui/sonner'
import { registerFlashToasts } from '@/components/flash-toaster';
import { SharedData } from '@/types';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        registerFlashToasts((props.initialPage.props as unknown as SharedData).flash);

        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
                <Toaster position="top-right" />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
        showSpinner: true,
        includeCSS: true,
        delay:250,
    },
});

// This will set light / dark mode on load...
initializeTheme();
