<?php

namespace App\Console\Commands;

use App\Models\Course;
use App\Notifications\CourseStartNotification;
use App\Notifications\CourseEndNotification;
use Illuminate\Console\Command;

class CheckCourseNotifications extends Command
{
    protected $signature = 'notifications:check-courses';
    protected $description = 'Verifica e envia notificações de início e término de cursos';

    public function handle()
    {
        $this->info('Verificando notificações de cursos...');
        
        // Cursos que começam em 24h
        $coursesStarting = Course::where('status', 'active')
            ->whereDate('start_date', now()->addDay()->toDateString())
            ->where('start_notification_sent', false)
            ->get();
            
        foreach ($coursesStarting as $course) {
            $this->info("Notificando sobre início do curso: {$course->title}");
            
            // Notificar professor
            $course->teacher->notify(new CourseStartNotification($course));
            
            // Notificar alunos aprovados
            foreach ($course->approvedStudents as $student) {
                $student->notify(new CourseStartNotification($course));
            }
            
            $course->update(['start_notification_sent' => true]);
        }
        
        // Cursos que terminam em 24h
        $coursesEnding = Course::where('status', 'active')
            ->whereDate('end_date', now()->addDay()->toDateString())
            ->where('end_notification_sent', false)
            ->get();
            
        foreach ($coursesEnding as $course) {
            $this->info("Notificando sobre término do curso: {$course->title}");
            
            // Notificar professor
            $course->teacher->notify(new CourseEndNotification($course));
            
            // Notificar alunos aprovados
            foreach ($course->approvedStudents as $student) {
                $student->notify(new CourseEndNotification($course));
            }
            
            $course->update(['end_notification_sent' => true]);
        }
        
        $this->info('Verificação concluída!');
        return Command::SUCCESS;
    }
}