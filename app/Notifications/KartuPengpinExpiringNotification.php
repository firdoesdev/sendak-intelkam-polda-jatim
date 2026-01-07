<?php

namespace App\Notifications;

use App\Models\KartuPengpin;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class KartuPengpinExpiringNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public KartuPengpin $kartuPengpin,
        public int $daysRemaining
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $daysText = $this->daysRemaining === 1 ? '1 hari' : "{$this->daysRemaining} hari";
        
        return (new MailMessage)
            ->subject('Kartu Pengpin Akan Segera Kadaluarsa')
            ->greeting('Yth. ' . $this->kartuPengpin->person->full_name)
            ->line("Kartu Penguasaan Pinjam Pakai Senjata Api Anda dengan nomor **{$this->kartuPengpin->pengpin_number}** akan kadaluarsa dalam {$daysText}.")
            ->line("**Tanggal Kadaluarsa:** " . $this->kartuPengpin->expiry_date->format('d F Y'))
            ->line("**Senjata Api:** {$this->kartuPengpin->weapon->serial_number} - {$this->kartuPengpin->weapon->name}")
            ->action('Lihat Detail Kartu', route('kartu-pengpin.show', $this->kartuPengpin))
            ->line('Harap segera melakukan perpanjangan jika diperlukan.')
            ->line('Terima kasih.');
    }

    /**
     * Get the database representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'kartu_pengpin_id' => $this->kartuPengpin->id,
            'pengpin_number' => $this->kartuPengpin->pengpin_number,
            'days_remaining' => $this->daysRemaining,
            'expiry_date' => $this->kartuPengpin->expiry_date->format('Y-m-d'),
            'message' => "Kartu Pengpin {$this->kartuPengpin->pengpin_number} akan kadaluarsa dalam {$this->daysRemaining} hari",
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return $this->toDatabase($notifiable);
    }
}
