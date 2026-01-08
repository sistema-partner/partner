<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CourseModule extends Model
{
    protected $fillable = [
        'course_id',
        'title',
        'description',
        'order',
        'slug',
        'is_public'
    ];

    protected $casts = [
        'order' => 'integer',
        'is_public' => 'boolean'
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function contents(): BelongsToMany
    {
        // Pivot table columns are module_id & content_id (not course_module_id)
        return $this->belongsToMany(Content::class, 'module_content', 'course_module_id', 'content_id')
            ->withPivot('order')
            ->withTimestamps()
            ->orderBy('order');
    }

    public function moduleContents()
    {
        return $this->hasMany(ModuleContent::class, 'course_module_id')->orderBy('order');
    }

    public function publishedContents()
    {
        return $this->contents()->where('is_public', true);
    }

    public function units()
    {
        return $this->hasMany(ModuleUnit::class)->orderBy('order');
    }
}