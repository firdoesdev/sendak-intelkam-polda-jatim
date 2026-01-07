<?php

namespace App\Console\Commands;

use App\Enums\KartuPengpinStatus;
use App\Models\KartuPengpin;
use Illuminate\Console\Command;

class ExpireKartuPengpin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'kartu-pengpin:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update status Kartu Pengpin yang sudah kadaluarsa menjadi EXPIRED';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Mencari Kartu Pengpin yang sudah kadaluarsa...');

        // Ambil semua kartu dengan status ACTIVE yang sudah lewat expiry_date
        $expiredCards = KartuPengpin::where('status', KartuPengpinStatus::ACTIVE)
            ->where('expiry_date', '<', now())
            ->get();

        if ($expiredCards->isEmpty()) {
            $this->info('✅ Tidak ada Kartu Pengpin yang perlu diupdate.');
            return Command::SUCCESS;
        }

        $count = $expiredCards->count();
        $this->info("Ditemukan {$count} Kartu Pengpin yang sudah kadaluarsa.");

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        foreach ($expiredCards as $card) {
            $card->update([
                'status' => KartuPengpinStatus::EXPIRED,
            ]);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("✅ Berhasil mengupdate {$count} Kartu Pengpin menjadi EXPIRED.");

        return Command::SUCCESS;
    }
}
