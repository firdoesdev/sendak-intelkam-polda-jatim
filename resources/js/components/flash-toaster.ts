import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { SharedData } from '@/types';

type Flash = SharedData['flash'] | undefined;

function showFlash(flash: Flash): void {
    if (!flash) {
        return;
    }

    if (flash.success) {
        toast.success(flash.success);
    }

    if (flash.error) {
        toast.error(flash.error);
    }

    if (flash.message) {
        toast(flash.message);
    }
}

/**
 * Show toast notifications from server-side flash messages.
 *
 * Runs outside the React tree (driven by Inertia router events) so it does not
 * depend on the page context provider, which only exists inside <App />.
 */
export function registerFlashToasts(initialFlash: Flash): void {
    showFlash(initialFlash);

    router.on('success', (event) => {
        showFlash((event.detail.page.props as unknown as SharedData).flash);
    });
}
