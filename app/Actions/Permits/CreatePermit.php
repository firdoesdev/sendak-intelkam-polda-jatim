<?php

namespace App\Actions\Permits;

use App\Models\Permit;
use Illuminate\Support\Facades\Auth;
use Gate;

class CreatePermit
{
    public function __construct()
    {
        //
    }

    public function execute(array $data): Permit
    {

        Gate::authorize('create', Permit::class);
        

        $data['created_by'] = Auth::id();
        $data['status'] = $data['status'] ?? 'draft';
        
        // Set submitted_at if status is pending
        if ($data['status'] === 'pending') {
            $data['submitted_at'] = now();
        }

        return Permit::create($data);
    }
}
