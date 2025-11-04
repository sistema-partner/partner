<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Tag extends Model
{
    protected $fillable = [
        'name', 'slug', 'type', 'usage_count'
    ];

    public function courses(): MorphToMany
    {
        return $this->morphToMany(Course::class, 'taggable')
                    ->withPivot('weight', 'context')
                    ->withTimestamps();
    }

    public function contents(): MorphToMany
    {
        return $this->morphToMany(Content::class, 'taggable')
                    ->withPivot('weight', 'context')
                    ->withTimestamps();
    }

    // Escopos úteis
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopePopular($query, int $minUsage = 5)
    {
        return $query->where('usage_count', '>=', $minUsage)
                     ->orderBy('usage_count', 'desc');
    }
}