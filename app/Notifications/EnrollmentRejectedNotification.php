<?php

namespace App\Notifications;

use App\Models\Enrollment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EnrollmentRejectedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Enrollment $enrollment) {}

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
        return (new MailMessage)
            ->subject('Matrícula Rejeitada ❌ ' . $this->enrollment->course->title)
            ->greeting('Olá ' . $notifiable->name . ',')
            ->line('Sua solicitação de matrícula no curso "' . $this->enrollment->course->title . '" foi rejeitada.')
            ->action('Acessar plataforma', url('/dashboard'))
            ->line('Equipe ' . config('app.name'));
    }
    
    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Matrícula Rejeitada ❌',
            'message' => 'Sua matrícula no curso "' . $this->enrollment->course->title . '" foi rejeitada.',
            'type' => 'enrollment_rejected',
            'course_id' => $this->enrollment->course->id,
            'course_title' => $this->enrollment->course->title,
            'enrollment_id' => $this->enrollment->id,
            'url' => '/courses/' . $this->enrollment->course->id,
        ];
    }
}
