<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('web')
                ->group(base_path('routes/iam.php'));
            Route::middleware('web')
                ->group(base_path('routes/master-data.php'));
            Route::middleware('web')
                ->group(base_path('routes/permits.php'));
            Route::middleware('web')
                ->group(base_path('routes/settings.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies('*');
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function (Response $response, Throwable $e, Request $request) {
            $status = $response->getStatusCode();

            // CSRF token mismatch: send the user back with a friendly message.
            if ($status === 419) {
                return back()->with('error', 'Halaman kedaluwarsa, silakan coba lagi.');
            }

            // Authorization denied on an Inertia request: redirect back with a flash
            // so the user sees a toast instead of a raw, non-Inertia error response.
            if ($status === 403 && $request->inertia()) {
                return back()->with('error', 'Anda tidak memiliki akses untuk melakukan tindakan ini.');
            }

            // Friendly Inertia error pages for unhandled HTTP errors in production.
            // Locally the default Inertia error modal is kept so the real backend
            // exception/stack trace stays visible while debugging.
            if (! app()->environment(['local', 'testing'])
                && in_array($status, [500, 503, 404, 403])) {
                return Inertia::render('error-page', ['status' => $status])
                    ->toResponse($request)
                    ->setStatusCode($status);
            }

            return $response;
        });
    })->create();
