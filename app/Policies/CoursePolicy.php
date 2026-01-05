<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CoursePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Course $course): bool
    {
        // professor dono
        if ($course->teacher_id === $user->id) {
            return true;
        }

        // aluno matriculado e aprovado
        return $course->enrollments()
            ->where('student_id', $user->id)
            ->where('status', 'approved')
            ->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Course $course): bool
    {
        return $course->teacher_id === $user->id;
    }

    public function delete(User $user, Course $course): bool
    {
        return $course->teacher_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Course $course): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Course $course): bool
    {
        return false;
    }

    public function manage(User $user, Course $course): bool
    {
        return $user->role === 'teacher'
            && $course->teacher_id === $user->id;
    }
}
