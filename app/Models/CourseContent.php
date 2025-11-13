<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class CourseContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'user_id',
        'type',
        'title',
        'body',
    ];

    protected static function boot()
    {
        parent::boot();
        static::saving(function (CourseContent $model) {
            if (empty($model->type)) {
                $model->type = 'announcement';
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable')
                    ->withPivot('weight', 'context')
                    ->withTimestamps();
    }
}