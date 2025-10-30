<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Content extends Model
{
    protected $fillable = [
        'user_id', 'title', 'description', 'type', 'file_path', 'url', 
        'content', 'duration_minutes', 'is_public', 'download_count', 'view_count'
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(CourseModule::class, 'module_content')
                    ->withPivot('order')
                    ->withTimestamps();
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable')
                    ->withPivot('weight', 'context')
                    ->withTimestamps();
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(ContentRating::class);
    }

    public function averageRating(): float
    {
        return $this->ratings()->avg('stars') ?: 0;
    }

    public function usageCount(): int
    {
        return $this->modules()->count();
    }

    // Escopos úteis
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeWithHighRating($query, float $minRating = 4.0)
    {
        return $query->whereHas('ratings', function ($q) use ($minRating) {
            $q->selectRaw('AVG(stars) as avg_rating')
              ->having('avg_rating', '>=', $minRating);
        });
    }
}