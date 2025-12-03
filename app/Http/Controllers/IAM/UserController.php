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

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        
        $users = User::with('policeUnit', 'defaultDivision')
                ->when($request->search, function ($query, $search) {
                    $query->whereRaw('LOWER(name) like ?', ['%' . strtolower($search) . '%'])
                        ->orWhereRaw('LOWER(email) like ?', ['%' . strtolower($search) . '%']);
                })
                ->orderBy('created_at', 'desc')
                ->paginate(10)
                ->withQueryString();
        return Inertia::render('iam/users/page', [
            'data' => $users
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

        return redirect()->route('users.index');
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

        return redirect()->route('users.index');
   
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, DeleteUser $deleteUser)
    {
        //
        $deleteUser->execute((int)$id);
        return redirect()->route('users.index');
    }
}
