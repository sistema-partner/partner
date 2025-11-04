<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContentRating extends Model
{
    protected $fillable = [
        'content_id', 'user_id', 'stars', 'comment', 'suggestions'
    ];

    protected $casts = [
        'stars' => 'integer',
    ];

    public function content(): BelongsTo
    {
        return $this->belongsTo(Content::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}