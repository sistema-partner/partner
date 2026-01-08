<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuleContent extends Model
{
    protected $table = 'module_content';

    protected $fillable = [
        'module_id',
        'content_id',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(CourseModule::class, 'course_module_id');
    }

    public function content(): BelongsTo
    {
        return $this->belongsTo(Content::class, 'content_id');
    }

    // Escopo para ordenar
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
