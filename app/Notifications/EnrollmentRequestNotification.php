<?php

namespace App\Notifications;

use App\Models\Enrollment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EnrollmentRequestNotification extends Notification // 👈 REMOVA "implements ShouldQueue"
{
    use Queueable;

    public function __construct(public Enrollment $enrollment) {}

    public function via(object $notifiable): array
    {
        return ['database']; // 👈 REMOVA 'mail' temporariamente
    }

    public function toDatabase(object $notifiable): array
    {
        // 👈 ADICIONE ESTE MÉTODO SE NÃO EXISTIR
        return [
            'title' => 'Nova Solicitação de Matrícula 📥',
            'message' => $this->enrollment->student->name . ' solicitou entrada no curso "' . $this->enrollment->course->title . '"',
            'type' => 'enrollment_request',
            'course_id' => $this->enrollment->course->id,
            'course_title' => $this->enrollment->course->title,
            'student_id' => $this->enrollment->student->id,
            'student_name' => $this->enrollment->student->name,
            'enrollment_id' => $this->enrollment->id,
            'url' => '/courses/' . $this->enrollment->course->id . '/enrollments',
        ];
    }

    public function toArray(object $notifiable): array
    { return $this->toDatabase($notifiable);
    }
}