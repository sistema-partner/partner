<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id', 'title', 'code', 'description', 'image_url',
        'status', 'visibility', 'max_students', 'start_date', 'end_date',
        'accepts_enrollments'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'accepts_enrollments' => 'boolean',
        'max_students' => 'integer'
    ];

    // Relações
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function activeEnrollments()
    {
        return $this->hasMany(Enrollment::class)->where('status', 'approved');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByTeacher($query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }

    public function scopeAcceptsEnrollments($query)
    {
        return $query->where('accepts_enrollments', true);
    }

    public function isActive()
    {
        return $this->status === 'active';
    }

    public function canEnroll()
    {
        return $this->accepts_enrollments && 
               $this->isActive() && 
               ($this->max_students === null || 
                $this->activeEnrollments()->count() < $this->max_students);
    }

    public function contents()
    {
        return $this->hasMany(CourseContent::class)->latest(); 
    }
    
    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments', 'course_id', 'student_id')
            ->withPivot('status', 'approved_at')
            ->withTimestamps();
    }
    
    public function approvedStudents()
    {
        return $this->students()->wherePivot('status', 'approved');
    }
}