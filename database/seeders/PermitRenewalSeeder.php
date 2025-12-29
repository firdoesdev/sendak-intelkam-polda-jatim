<?php

namespace Database\Seeders;

use App\Models\Permit;
use App\Models\PermitRenewal;
use App\Models\User;
use Illuminate\Database\Seeder;

class PermitRenewalSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil permit yang memiliki valid_to (end_date)
        $permits = Permit::whereNotNull('valid_to')->limit(5)->get();
        
        if ($permits->isEmpty()) {
            $this->command->warn('No permits with valid_to found. Please create permits with end dates first.');
            return;
        }

        $user = User::first();
        
        if (!$user) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        $statuses = ['pending', 'approved', 'rejected'];
        
        foreach ($permits as $index => $permit) {
            $renewalNumber = 'RNW-' . date('Y') . '-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT);
            $status = $statuses[$index % 3];
            
            $renewal = PermitRenewal::create([
                'renewal_number' => $renewalNumber,
                'permit_id' => $permit->id,
                'current_valid_to' => $permit->valid_to,
                'new_valid_to' => $permit->valid_to->copy()->addMonths(6),
                'status' => $status,
                'reason' => 'Perpanjangan izin karena masih digunakan untuk operasional.',
                'requested_by' => $user->id,
                'submitted_at' => now()->subDays(rand(1, 30)),
            ]);
            
            // Jika status approved, set approver dan approved_at
            if ($status === 'approved') {
                $renewal->update([
                    'approved_by' => $user->id,
                    'approved_at' => now()->subDays(rand(0, 10)),
                ]);
            }
            
            // Jika status rejected, set rejection_reason
            if ($status === 'rejected') {
                $renewal->update([
                    'approved_by' => $user->id,
                    'approved_at' => now()->subDays(rand(0, 10)),
                    'rejection_reason' => 'Dokumen tidak lengkap.',
                ]);
            }
        }

        $this->command->info('PermitRenewal seeder completed successfully.');
    }
}
