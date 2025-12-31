# Sendak - AI Coding Assistant Instructions

## Architecture Overview

This is a **Laravel 12 + Inertia.js + React 19** application for weapons permit management system. The codebase follows a domain-driven structure with Action classes handling business logic.

### Tech Stack
- **Backend**: Laravel 12 (PHP 8.2+), Laravel Fortify for auth, Spatie packages (permissions, activity logging)
- **Frontend**: React 19 with TypeScript, Inertia.js for SPA routing, TailwindCSS 4, shadcn/ui components
- **Testing**: Pest (PHPUnit wrapper)
- **Build**: Vite with SSR support, Laravel Wayfinder for type-safe routing

### Domain Structure

The application is organized into bounded contexts:
- **IAM**: Identity and Access Management (users, roles, permissions)
- **MasterData**: Reference data (divisions, police units, organizations, warehouses, applicants)
- **Permits**: Core permit issuance and lifecycle management
- **PermitRenewals**: Renewal workflow with approval/rejection
- **Weapons**: Weapon inventory, transfers, and movement tracking

## Critical Patterns

### 1. Action Classes Pattern

Business logic lives in `app/Actions/{Domain}/{ActionName}.php` classes, NOT in controllers. Controllers are thin orchestrators.

```php
// Example: app/Actions/Permits/CreatePermit.php
class CreatePermit {
    public function execute(array $data): Permit {
        $data['created_by'] = Auth::id();
        return Permit::create($data);
    }
}

// Controller injects and calls actions
class PermitController extends Controller {
    public function __construct(private CreatePermit $createPermit) {}
    
    public function store(PermitStoreRequest $request) {
        $permit = $this->createPermit->execute($request->validated());
        // ...
    }
}
```

**When creating new features**: Always create Action classes first, then wire them into controllers.

### 2. Type-Safe Routing with Wayfinder

Frontend uses auto-generated TypeScript route helpers from Laravel Wayfinder. Routes are defined in `resources/js/routes/{domain}/index.ts`.

```tsx
// Navigate using type-safe helpers
import permits from '@/routes/permits';

<Link href={permits.show({ permit: id }).url}>View Permit</Link>
```

**Never hardcode URLs** - always use the generated route helpers. Run `npm run build` to regenerate route types after adding Laravel routes.

### 3. Enum Pattern

Use PHP backed enums for status/type fields with `label()` and `variant()` methods:

```php
// app/Enums/PermitStatus.php
enum PermitStatus: string {
    case DRAFT = 'draft';
    case PENDING = 'pending';
    
    public function label(): string {
        return match($this) {
            self::DRAFT => 'Draft',
            self::PENDING => 'Menunggu Persetujuan',
        };
    }
    
    public function variant(): string {
        return match($this) {
            self::DRAFT => 'secondary',
            self::PENDING => 'warning',
        };
    }
}
```

## Development Workflows

### Setup
```bash
composer install && npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run dev  # Start Vite dev server (required for frontend)
```

### Running Tests
```bash
./vendor/bin/pest           # All tests
./vendor/bin/pest --filter PermitTest  # Specific test
```

### Code Quality
```bash
./vendor/bin/pint          # Laravel Pint for PHP formatting
npm run lint               # ESLint for TypeScript/React
npm run format             # Prettier for frontend code
npm run types              # TypeScript type checking
```

### Building for Production
```bash
npm run build              # Builds assets
npm run build:ssr          # Builds with SSR support
```

## Key Conventions

1. **Route Organization**: Split by domain in `routes/{domain}.php`, all included in `routes/web.php`
2. **Inertia Pages**: Located at `resources/js/pages/{domain}/`, must return from `resolvePageComponent()` in app.tsx
3. **Layouts**: Use `<AppLayout>` wrapper from `resources/js/layouts/app-layout.tsx` for authenticated pages
4. **UI Components**: Prefer shadcn/ui components from `resources/js/components/ui/` over custom implementations
5. **Data Tables**: Use TanStack Table (`@tanstack/react-table`) for list views
6. **Forms**: Use React Hook Form with Zod validation, submit via Inertia form helpers
7. **Auth Middleware**: All authenticated routes must have `['auth', 'verified']` middleware group
8. **Model Auditing**: Models automatically track `created_by`/`updated_by` via Action classes

## Integration Points

- **Spatie Permissions**: Roles/permissions via `spatie/laravel-permission`, check with `@can()` in Blade or `usePage().props.auth.user.permissions` in React
- **Activity Logging**: Automatic via `spatie/laravel-activitylog`, logged activities viewable per model
- **Laravel Fortify**: Handles auth flows (login, register, 2FA), configuration in `config/fortify.php`

## Common Gotchas

- **SSR Support**: Pages must be SSR-compatible (no `window` access on render), use `useEffect` for client-only code
- **Inertia Shared Data**: Auth user and flash messages available via `usePage().props` hook
- **Route Caching**: Run `php artisan route:cache` breaks Wayfinder - clear with `php artisan route:clear` in dev
- **Vite Must Be Running**: Frontend won't load without `npm run dev` in development
- **React 19 Compiler**: Enabled via `babel-plugin-react-compiler`, avoid manual `useCallback`/`useMemo` unless necessary

## File References

- Domain route files: `routes/{iam,master-data,permits,weapons}.php`
- Action classes: `app/Actions/{Domain}/`
- Inertia pages: `resources/js/pages/{domain}/`
- Generated routes: `resources/js/routes/` (auto-generated, don't edit manually)
- Enums: `app/Enums/`
- Models: `app/Models/`
