<?php

namespace App\Notifications;

use App\Models\Course;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CourseEndNotification extends Notification implements ShouldQueue
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
            ->subject('📚 Curso Encerrando - ' . $this->course->title)
            ->greeting('Olá ' . $notifiable->name . '!')
            ->line('O curso **' . $this->course->title . '** está prestes a encerrar!')
            ->line('**Data de encerramento:** ' . $this->course->end_date->format('d/m/Y'))
            ->action('Acessar Curso', url('/courses/' . $this->course->id))
            ->line('Não deixe para última hora! Finalize suas atividades.')
            ->salutation('Equipe ' . config('app.name'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Curso Encerrando 📚',
            'message' => 'O curso "' . $this->course->title . '" está prestes a terminar!',
            'type' => 'course_end',
            'course_id' => $this->course->id,
            'course_title' => $this->course->title,
            'end_date' => $this->course->end_date?->toISOString(),
            'url' => '/courses/' . $this->course->id,
        ];
    }
}