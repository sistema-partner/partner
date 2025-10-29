<?php

namespace App\Notifications;

use App\Models\Course;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CourseStartNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Course $course) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('🚀 Curso Iniciando - ' . $this->course->title)
            ->greeting('Olá ' . $notifiable->name . '!')
            ->line('O curso **' . $this->course->title . '** está prestes a iniciar!')
            ->line('**Data de início:** ' . $this->course->start_date->format('d/m/Y'))
            ->action('Acessar Curso', url('/courses/' . $this->course->id))
            ->line('Prepare-se para uma jornada incrível de aprendizado!')
            ->salutation('Equipe ' . config('app.name'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Curso Iniciando 🚀',
            'message' => 'O curso "' . $this->course->title . '" está prestes a começar!',
            'type' => 'course_start',
            'course_id' => $this->course->id,
            'course_title' => $this->course->title,
            'start_date' => $this->course->start_date?->toISOString(),
            'url' => '/courses/' . $this->course->id,
        ];
    }
}