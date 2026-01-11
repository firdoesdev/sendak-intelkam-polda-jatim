<?php

namespace App\Actions\Permits;

use App\Models\Permit;
use Illuminate\Support\Facades\Auth;

class CheckAndUpdateToExpired
{
    public function __construct()
    {
        //
    }

    public function execute(): void
    {
        $now = now();

        $permitsToExpire = Permit::where('status', 'approved')
            ->where('valid_to', '<=', $now)
            ->get();

        foreach ($permitsToExpire as $permit) {
            $permit->status = 'expired';
            $permit->updated_by = Auth::id() ?? null;
            $permit->save();
        }
    }
}
