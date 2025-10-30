<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Enrollment;
use App\Models\CourseContent;
use App\Models\CourseModule;
use App\Models\Tag;
use App\Models\Content;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;


class Course extends Model
{

    protected $fillable = [
        'teacher_id',
        'title',
        'code',
        'description',
        'image_path',
        'cover_path',
        'status',
        'visibility',
        'max_students',
        'start_date',
        'end_date',
        'accepts_enrollments'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'accepts_enrollments' => 'boolean',
        'max_students' => 'integer'
    ];

    protected $appends = ['image_url', 'cover_url'];

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

    public function modules(): HasMany
    {
        return $this->hasMany(CourseModule::class)->orderBy('order');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable')
            ->withPivot('weight', 'context')
            ->withTimestamps();
    }

    public function getMainTagsAttribute()
    {
        return $this->tags()->wherePivot('weight', '>=', 0.7)->get();
    }

    public function recommendedContents()
    {
        $courseTags = $this->tags()->pluck('tags.id');

        return Content::public()
            ->whereHas('tags', function ($query) use ($courseTags) {
                $query->whereIn('tags.id', $courseTags);
            })
            ->withHighRating(4.0)
            ->withCount('modules')
            ->orderBy('usage_count', 'desc')
            ->orderBy('view_count', 'desc')
            ->get();
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? asset('storage/' . $this->image_path) : null;
    }

    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_path ? asset('storage/' . $this->cover_path) : null;
    }

}