<?php

namespace App\Http\Controllers\IAM;

use App\Actions\IAM\AssignPermissionsToRole;
use App\Actions\IAM\CreateRole;
use App\Actions\IAM\DeleteRole;
use App\Actions\IAM\ListRole;
use App\Actions\IAM\UpdateRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\IAM\AssignPermissionsRequest;
use App\Http\Requests\IAM\RoleStoreRequest;
use App\Http\Requests\IAM\RoleUpdateRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, ListRole $listRole)
    {
        return Inertia::render('iam/roles/page', [
            'data' => $listRole->execute([
                'search' => $request->search ?? null
            ])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleStoreRequest $request, CreateRole $createRole)
    {
        $createRole->execute($request->validated());

        return redirect()->route('iam.roles.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        $allPermissions = Permission::orderBy('name')->get();

        return Inertia::render('iam/roles/show', [
            'role' => $role,
            'allPermissions' => $allPermissions,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleUpdateRequest $request, string $id, UpdateRole $updateRole)
    {
        $updateRole->execute((int)$id, $request->validated());

        return redirect()->route('iam.roles.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, DeleteRole $deleteRole)
    {
        $deleteRole->execute((int)$id);
        
        return redirect()->route('iam.roles.index');
    }

    /**
     * Assign permissions to a role.
     */
    public function assignPermissions(
        AssignPermissionsRequest $request,
        string $id,
        AssignPermissionsToRole $assignPermissions
    ) {
        $assignPermissions->execute((int)$id, $request->validated()['permission_ids']);

        return back()->with('success', 'Permissions assigned successfully');
    }
}
