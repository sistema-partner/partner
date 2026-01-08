<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Course extends Model
{
    protected $fillable = [
        'teacher_id',
        'title',
        'code',
        'description',
        'image_url',
        'status',              // planned | active | finished
        'visibility',          // public | private | unlisted
        'enrollment_policy',   // closed | auto | approval
        'setup_step',          // about | settings | curriculum | completed
        'max_students',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'max_students' => 'integer',
    ];

    protected $appends = [
        'modules_count',
        'units_count',
    ];

    protected $with = ['teacher'];

    /* ===========================
     |  RELATIONSHIPS
     =========================== */

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function approvedEnrollments(): HasMany
    {
        return $this->enrollments()->where('status', 'approved');
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'enrollments', 'course_id', 'student_id')
            ->withPivot(['status', 'approved_at'])
            ->withTimestamps();
    }

    public function approvedStudents(): BelongsToMany
    {
        return $this->students()->wherePivot('status', 'approved');
    }

    public function modules(): HasMany
    {
        return $this->hasMany(CourseModule::class)->orderBy('order');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable')
            ->withPivot(['weight', 'context'])
            ->withTimestamps();
    }

    /* ===========================
     |  SCOPES
     =========================== */

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByTeacher($query, int $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }

    public function scopePublic($query)
    {
        return $query->where('visibility', 'public');
    }

    /* ===========================
     |  HELPERS / BUSINESS LOGIC
     =========================== */

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function canAcceptEnrollments(): bool
    {
        if ($this->enrollment_policy === 'closed') {
            return false;
        }

        if (!in_array($this->status, ['active', 'planned'])) {
            return false;
        }

        if (
            $this->max_students !== null &&
            $this->approvedEnrollments()->count() >= $this->max_students
        ) {
            return false;
        }

        return true;
    }

    public function requiresApproval(): bool
    {
        return $this->enrollment_policy === 'approval';
    }

    public function isAutoEnroll(): bool
    {
        return $this->enrollment_policy === 'auto';
    }

    /* ===========================
     |  ACCESSORS
     =========================== */

    public function getModulesCountAttribute(): int
    {
        return $this->relationLoaded('modules')
            ? $this->modules->count()
            : $this->modules()->count();
    }

    public function getUnitsCountAttribute(): int
    {
        if ($this->relationLoaded('modules')) {
            return $this->modules->sum(
                fn($module) => $module->units?->count() ?? 0
            );
        }

        return ModuleUnit::whereHas('module', function ($q) {
            $q->where('course_id', $this->id);
        })->count();
    }
}
