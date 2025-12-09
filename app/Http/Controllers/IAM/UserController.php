<?php

namespace App\Http\Controllers\IAM;

use App\Http\Controllers\Controller;
use App\Http\Requests\IAM\UserStoreRequest;
use App\Http\Requests\IAM\UserUpdateRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

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
    public function update(UserUpdateRequest $request, string $id, UpdateUser $updateUser)
    {
        $updateUser->execute((int)$id, $request->validated());

        return redirect()->route('iam.users.index');
   
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, DeleteUser $deleteUser)
    {
        //
        $deleteUser->execute((int)$id);
        return redirect()->route('iam.users.index');
    }
}
