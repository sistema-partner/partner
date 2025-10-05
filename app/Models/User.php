<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'status', 
        'avatar', 'phone', 'bio', 'institution'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Relações
    public function taughtCourses()
    {
        return $this->hasMany(Course::class, 'teacher_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'student_id');
    }

    public function approvedCourses()
    {
        return $this->hasMany(Enrollment::class, 'approved_by');
    }

    // Scopes
    public function scopeTeachers($query)
    {
        return $query->where('role', 'teacher')->where('status', 'approved');
    }

    public function scopeStudents($query)
    {
        return $query->where('role', 'student')->where('status', 'approved');
    }

    // Helpers
    public function isTeacher()
    {
        return $this->role === 'teacher' && $this->status === 'approved';
    }

    public function isStudent()
    {
        return $this->role === 'student' && $this->status === 'approved';
    }

    public function isResearcher()
    {
        return $this->role === 'researcher' && $this->status === 'approved';
    }
}