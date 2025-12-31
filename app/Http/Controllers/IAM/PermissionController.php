<?php

namespace App\Http\Controllers\IAM;

use App\Actions\IAM\CreatePermission;
use App\Actions\IAM\DeletePermission;
use App\Actions\IAM\ListPermission;
use App\Actions\IAM\UpdatePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\IAM\PermissionStoreRequest;
use App\Http\Requests\IAM\PermissionUpdateRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, ListPermission $listPermission)
    {
        return Inertia::render('iam/permissions/page', [
            'data' => $listPermission->execute([
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
    public function store(PermissionStoreRequest $request, CreatePermission $createPermission)
    {
        $createPermission->execute($request->validated());

        return redirect()->route('iam.permissions.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    public function update(PermissionUpdateRequest $request, string $id, UpdatePermission $updatePermission)
    {
        $updatePermission->execute((int)$id, $request->validated());

        return redirect()->route('iam.permissions.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, DeletePermission $deletePermission)
    {
        $deletePermission->execute((int)$id);
        
        return redirect()->route('iam.permissions.index');
    }
}
