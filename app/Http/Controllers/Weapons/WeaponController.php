<?php

namespace App\Http\Controllers\Weapons;

use App\Actions\Weapons\CreateWeapon;
use App\Actions\Weapons\DeleteWeapon;
use App\Actions\Weapons\ListWeapon;
use App\Actions\Weapons\UpdateWeapon;
use App\Enums\PermitType;
use App\Enums\WeaponCondition;
use App\Enums\WeaponStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Weapons\WeaponStoreRequest;
use App\Http\Requests\Weapons\WeaponUpdateRequest;
use App\Models\Warehouse;
use App\Models\Weapon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class WeaponController extends Controller
{
    private $listWeapon;

    private $createWeapon;

    private $updateWeapon;

    private $deleteWeapon;

    public function __construct(
        ListWeapon $listWeapon,
        CreateWeapon $createWeapon,
        UpdateWeapon $updateWeapon,
        DeleteWeapon $deleteWeapon
    ) {
        $this->listWeapon = $listWeapon;
        $this->createWeapon = $createWeapon;
        $this->updateWeapon = $updateWeapon;
        $this->deleteWeapon = $deleteWeapon;
    }

    public function index(Request $request)
    {
        Gate::authorize('viewAny', Weapon::class);

        return Inertia::render('weapons/index', [
            'data' => $this->listWeapon->execute([
                'search' => $request->search ?? null,
                'warehouse_id' => $request->warehouse_id ?? null,
                'permit_type' => $request->permit_type ?? null,
                'status' => $request->status ?? null,
                'condition' => $request->condition ?? null,
            ]),
            'warehouses' => Warehouse::select('id', 'name', 'code')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
            'permitTypes' => collect(PermitType::cases())->map(fn ($type) => [
                'value' => $type->value,
                'label' => $type->label(),
            ]),
            'statuses' => collect(WeaponStatus::cases())->map(fn ($status) => [
                'value' => $status->value,
                'label' => $status->label(),
                'variant' => $status->variant(),
            ]),
            'conditions' => collect(WeaponCondition::cases())->map(fn ($condition) => [
                'value' => $condition->value,
                'label' => $condition->label(),
                'variant' => $condition->variant(),
            ]),
        ]);
    }

    public function show(string $id)
    {
        //
    }

    public function store(WeaponStoreRequest $request)
    {
        try {
            $this->createWeapon->execute($request->validated());

            return to_route('weapons.index')->with('success', 'Senjata berhasil ditambahkan.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(WeaponUpdateRequest $request, string $id)
    {
        try {
            $this->updateWeapon->execute($id, $request->validated());

            return to_route('weapons.index')->with('success', 'Senjata berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy(string $id)
    {
        $weapon = Weapon::findOrFail($id);
        Gate::authorize('delete', $weapon);

        try {
            $this->deleteWeapon->execute($id);

            return to_route('weapons.index')->with('success', 'Senjata berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
