<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

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
        'view_count',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'duration_minutes' => 'integer',
        'view_count' => 'integer',
    ];

    /**
     * Tipos de CONTEÚDO reutilizável.
     * (não confundir com tipos de unidade)
     */
    public const TYPES = [
        'video',
        'pdf',
        'document',
        'link',
        'text',
    ];

    /**
     * Tipos que exigem arquivo físico
     */
    protected const FILE_TYPES = [
        'pdf',
        'document',
    ];

    /**
     * Validações de domínio
     */
    protected static function booted(): void
    {
        static::saving(function (Content $model) {

            // Normaliza tipo
            $model->type = strtolower($model->type);

            // Campos obrigatórios
            foreach (['user_id', 'title', 'type'] as $field) {
                if (empty($model->{$field})) {
                    throw new \InvalidArgumentException(
                        "Campo obrigatório '{$field}' ausente em Content."
                    );
                }
            }

            if (!in_array($model->type, self::TYPES, true)) {
                throw new \InvalidArgumentException(
                    "Tipo '{$model->type}' inválido. Permitidos: " . implode(', ', self::TYPES)
                );
            }

            // Regras por tipo
            if (in_array($model->type, self::FILE_TYPES, true) && empty($model->file_path)) {
                throw new \InvalidArgumentException(
                    "'file_path' é obrigatório para conteúdos do tipo {$model->type}."
                );
            }

            if ($model->type === 'link' && empty($model->url)) {
                throw new \InvalidArgumentException(
                    "'url' é obrigatório para conteúdos do tipo link."
                );
            }

            if ($model->type === 'text' && empty($model->content)) {
                throw new \InvalidArgumentException(
                    "'content' é obrigatório para conteúdos do tipo text."
                );
            }

            if ($model->type === 'video' && empty($model->url) && empty($model->file_path)) {
                throw new \InvalidArgumentException(
                    "Conteúdo de vídeo exige 'url' ou 'file_path'."
                );
            }
        });
    }

    /* ==========================================================
     | RELACIONAMENTOS
     ========================================================== */

    /**
     * Autor do conteúdo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Ligações do conteúdo com unidades de curso
     * (unit_contents)
     */
    public function unitContents(): HasMany
    {
        return $this->hasMany(UnitContent::class);
    }

    /**
     * Tags reutilizáveis (polimórfico)
     */
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable')
            ->withPivot('weight', 'context')
            ->withTimestamps();
    }

    /**
     * Avaliações do conteúdo
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(ContentRating::class);
    }

    /* ==========================================================
     | MÉTRICAS DERIVADAS
     ========================================================== */

    /**
     * Média de avaliação
     */
    public function averageRating(): float
    {
        return (float) ($this->ratings()->avg('stars') ?? 0);
    }

    /**
     * Quantidade de vezes que o conteúdo foi usado
     * por unidades/cursos (não persistido)
     */
    public function usageCount(): int
    {
        return $this->unitContents()->count();
    }

    /* ==========================================================
     | SCOPES ÚTEIS
     ========================================================== */

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopePopular($query, int $minViews = 100)
    {
        return $query->where('view_count', '>=', $minViews);
    }

    public function scopeWithHighRating($query, float $minRating = 4.0)
    {
        return $query->whereHas('ratings', function ($q) use ($minRating) {
            $q->groupBy('content_id')
              ->havingRaw('AVG(stars) >= ?', [$minRating]);
        });
    }
}
