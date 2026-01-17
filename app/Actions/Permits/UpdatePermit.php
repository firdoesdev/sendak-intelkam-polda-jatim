<?php

namespace App\Actions\Permits;

use App\Models\Permit;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Gate;

class UpdatePermit
{
    public function __construct()
    {
        //
    }

    public function execute(int $id, array $data): Permit
    {
        // Find the permit
        $permit = Permit::findOrFail($id);
        
        // Authorize the update action
        Gate::authorize('update', $permit);


        // Store old status for comparison
        $oldStatus = $permit->status;   

        // set `updated_by` field by current user
        $data['updated_by'] = Auth::id();

        // Handle status transitions
        if (isset($data['status']) && $data['status'] !== $oldStatus) {
            $data = $this->handleStatusTransition($permit, $data, $oldStatus);
        }

        $permit->update($data);
        
        // Trigger notification on status change
        if (isset($data['status']) && $data['status'] !== $oldStatus) {
            // TODO: Implement notification system
            // Notification::send($permit->applicant, new PermitStatusChanged($permit, $oldStatus, $data['status']));
        }

        return $permit;
    }

    private function handleStatusTransition(Permit $permit, array $data, string $oldStatus): array
    {
        $newStatus = $data['status'];

        // Set submitted_at when transitioning to pending
        if ($newStatus === 'pending' && $oldStatus === 'draft') {
            $data['submitted_at'] = now();
        }

        // Generate permit_number and set approved_at when approving
        if ($newStatus === 'approved' && $oldStatus !== 'approved') {
            $data['approved_at'] = now();
            
            if (empty($permit->permit_number)) {
                $data['permit_number'] = $this->generatePermitNumber($permit);
            }
        }

        // TODO: Add role-based permission checks for status transitions
        // Example: Only users with 'approve-permits' permission can set status to 'approved'
        // if ($newStatus === 'approved' && !Auth::user()->can('approve-permits')) {
        //     throw new \Exception('Unauthorized to approve permits');
        // }

        return $data;
    }

    private function generatePermitNumber(Permit $permit): string
    {
        
        // Format: [PERMIT_TYPE]-[YEAR][MONTH]-[SEQUENTIAL]
        // Example: SENPI-202512-0001
        $year = now()->format('Y');
        $month = now()->format('m');
        $prefix = strtoupper($permit->permit_type);
        
        // Get the last permit number for this type and period
        $lastPermit = Permit::where('permit_type', $permit->permit_type)
            ->whereYear('approved_at', $year)
            ->whereMonth('approved_at', $month)
            ->whereNotNull('permit_number')
            ->orderBy('permit_number', 'desc')
            ->first();

        $sequential = 1;
        if ($lastPermit && $lastPermit->permit_number) {
            // Extract sequential number from last permit
            $parts = explode('-', $lastPermit->permit_number);
            if (count($parts) === 3) {
                $sequential = intval($parts[2]) + 1;
            }
        }

        return sprintf('%s-%s%s-%04d', $prefix, $year, $month, $sequential);
    }
}
