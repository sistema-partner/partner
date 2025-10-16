<?php

namespace App\Notifications;

use App\Models\Enrollment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EnrollmentApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Enrollment $enrollment) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('🎉 Matrícula Aprovada - ' . $this->enrollment->course->title)
            ->greeting('Olá ' . $notifiable->name . '!')
            ->line('Sua solicitação de matrícula no curso **' . $this->enrollment->course->title . '** foi aprovada!')
            ->action('Acessar Curso', url('/courses/' . $this->enrollment->course->id))
            ->line('O curso já está disponível na sua área de estudos.')
            ->salutation('Equipe ' . config('app.name'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Matrícula Aprovada 🎉',
            'message' => 'Sua matrícula no curso "' . $this->enrollment->course->title . '" foi aprovada!',
            'type' => 'enrollment_approved',
            'course_id' => $this->enrollment->course->id,
            'course_title' => $this->enrollment->course->title,
            'enrollment_id' => $this->enrollment->id,
            'url' => '/courses/' . $this->enrollment->course->id,
        ];
    }
}