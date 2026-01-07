<?php

namespace App\Console\Commands;

use App\Enums\KartuPengpinStatus;
use App\Models\KartuPengpin;
use App\Notifications\KartuPengpinExpiringNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class NotifyExpiringKartuPengpin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'kartu-pengpin:notify-expiring {--days=30 : Jumlah hari sebelum kadaluarsa}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mengirim notifikasi untuk Kartu Pengpin yang akan kadaluarsa';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $days = (int) $this->option('days');
        $this->info("Mencari Kartu Pengpin yang akan kadaluarsa dalam {$days} hari...");

        // Ambil kartu yang ACTIVE dan akan kadaluarsa dalam X hari
        $expiringCards = KartuPengpin::with(['person', 'weapon'])
            ->where('status', KartuPengpinStatus::ACTIVE)
            ->whereBetween('expiry_date', [
                now(),
                now()->addDays($days)
            ])
            ->get();

        if ($expiringCards->isEmpty()) {
            $this->info('✅ Tidak ada Kartu Pengpin yang perlu dinotifikasi.');
            return Command::SUCCESS;
        }

        $count = $expiringCards->count();
        $this->info("Ditemukan {$count} Kartu Pengpin yang akan kadaluarsa.");

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        foreach ($expiringCards as $card) {
            $daysRemaining = now()->diffInDays($card->expiry_date);
            
            // Kirim notifikasi ke pemegang kartu (person)
            // Note: Person model harus implements Notifiable trait
            if ($card->person && method_exists($card->person, 'notify')) {
                $card->person->notify(
                    new KartuPengpinExpiringNotification($card, $daysRemaining)
                );
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("✅ Berhasil mengirim {$count} notifikasi.");

        return Command::SUCCESS;
    }
}
