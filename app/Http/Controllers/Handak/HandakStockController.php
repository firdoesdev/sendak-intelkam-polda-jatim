<?php

namespace App\Http\Controllers\Handak;

use App\Actions\Handak\ListHandakStock;
use App\Http\Controllers\Controller;
use App\Models\Organization;
use Gate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HandakStockController extends Controller
{
    public function __construct(private ListHandakStock $listHandakStock) {}

    public function index(Request $request)
    {
        Gate::authorize('view-handak-stock');

        return Inertia::render('handak/stock/index', [
            'balances' => fn () => $this->listHandakStock->balances(),
            'data' => Inertia::defer(fn () => $this->listHandakStock->history([
                'organization_id' => $request->organization_id ?? null,
                'material_type' => $request->material_type ?? null,
            ])),
            'organizations' => fn () => Organization::orderBy('name')->get(['id', 'name']),
            'auth' => [
                'user' => $request->user()?->load('defaultDivision'),
            ],
        ]);
    }
}
