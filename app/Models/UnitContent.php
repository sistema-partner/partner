<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnitContent extends Model
{
    use HasFactory;

    protected $table = 'unit_contents';

    protected $fillable = [
        'unit_id',
        'content_id',
        'order',
    ];

    public function unit()
    {
        return $this->belongsTo(ModuleUnit::class, 'unit_id');
    }

    public function content()
    {
        return $this->belongsTo(Content::class, 'content_id');
    }
}
