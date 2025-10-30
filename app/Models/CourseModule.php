<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CourseModule extends Model
{
    protected $fillable = [
        'course_id', 'title', 'description', 'order', 'is_public'
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function contents(): BelongsToMany
    {
        return $this->belongsToMany(Content::class, 'module_content')
                    ->withPivot('order')
                    ->withTimestamps()
                    ->orderBy('order');
    }

    public function publishedContents()
    {
        return $this->contents()->where('is_public', true);
    }
}