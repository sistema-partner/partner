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
        'user_id',
        'title',
        'description',
        'type',
        'file_path',
        'url',
        'content',
        'duration_minutes',
        'is_public',
        'download_count',
        'view_count'
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'duration_minutes' => 'integer',
        'download_count' => 'integer',
        'view_count' => 'integer',
    ];

    public const TYPES = [
        'video',
        'pdf',
        'document',
        'quiz',
        'assignment',
        'link',
        'text'
    ];

    // Tipos que exigem arquivo
    protected const FILE_TYPES = ['pdf', 'document'];

    protected static function boot()
    {
        parent::boot();

        static::saving(function (Content $model) {
            // Normaliza tipo para lowercase
            if (!empty($model->type)) {
                $model->type = strtolower($model->type);
            }

            $required = ['user_id', 'title', 'type'];
            foreach ($required as $field) {
                if (empty($model->{$field})) {
                    throw new \InvalidArgumentException("Campo obrigatório '{$field}' ausente em Content.");
                }
            }

            if (!in_array($model->type, self::TYPES, true)) {
                throw new \InvalidArgumentException("Tipo '{$model->type}' inválido. Permitidos: " . implode(', ', self::TYPES));
            }

            // Regras por tipo
            if (in_array($model->type, self::FILE_TYPES)) {
                if (empty($model->file_path)) {
                    throw new \InvalidArgumentException("'file_path' é obrigatório para conteúdos do tipo {$model->type}.");
                }
            }
            if ($model->type === 'link' && empty($model->url)) {
                throw new \InvalidArgumentException("'url' é obrigatório para conteúdos do tipo link.");
            }
            if ($model->type === 'text' && empty($model->content)) {
                throw new \InvalidArgumentException("'content' é obrigatório para conteúdos do tipo text.");
            }
            if ($model->type === 'video' && empty($model->url) && empty($model->file_path)) {
                throw new \InvalidArgumentException("Vídeo requer 'url' ou 'file_path'.");
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(CourseModule::class, 'module_content', 'content_id', 'module_id')
            ->withPivot('id','order')
            ->withTimestamps();
    }

    public function moduleLinks()
    {
        return $this->hasMany(ModuleContent::class, 'content_id');
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