<?php

namespace App\Http\Controllers\IAM;

use App\Actions\IAM\AssignRolesToUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\IAM\AssignRolesRequest;
use App\Http\Requests\IAM\UserStoreRequest;
use App\Http\Requests\IAM\UserUpdateRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Spatie\Permission\Models\Role;

use App\Actions\IAM\DeleteUser;
use App\Actions\IAM\UpdateUser;
use App\Actions\Fortify\CreateNewUser;
use App\Actions\IAM\ListUser;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, ListUser $listUser)
    {
        return Inertia::render('iam/users/index', [
            'data' => $listUser->execute([
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
    public function store(UserStoreRequest $request, CreateNewUser $createNewUser)
    {
        $createNewUser->create($request->validated());

        return redirect()->route('iam.users.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::with('roles')->findOrFail($id);
        $allRoles = Role::orderBy('name')->get();

        return Inertia::render('iam/users/show', [
            'user' => $user,
            'allRoles' => $allRoles,
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
    public function update(UserUpdateRequest $request, string $id, UpdateUser $updateUser)
    {
        $updateUser->execute((int)$id, $request->validated());

        return redirect()->route('iam.users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, DeleteUser $deleteUser)
    {
        $deleteUser->execute((int)$id);
        return redirect()->route('iam.users.index');
    }

    /**
     * Assign roles to a user.
     */
    public function assignRoles(
        AssignRolesRequest $request,
        string $id,
        AssignRolesToUser $assignRoles
    ) {
        $assignRoles->execute((int)$id, $request->validated()['role_ids']);

        return back()->with('success', 'Roles assigned successfully');
    }
}
