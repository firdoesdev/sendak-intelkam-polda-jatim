<?php

namespace App\Http\Controllers\IAM;

use App\Http\Controllers\Controller;
use App\Http\Requests\IAM\UserStoreRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        
        $users = User::when($request->search, function ($query, $search) {
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
    public function store(UserStoreRequest $request)
    {
        //
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        User::destroy($id);
        return redirect()->route('users.index');
    }
}
