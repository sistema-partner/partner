<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModuleUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_id',
        'title',
        'description',
        'type',
        'order',
        'is_optional',
    ];

    /*
     |--------------------------------------------------------------------------
     | Relationships
     |--------------------------------------------------------------------------
     */

    public function module()
    {
        return $this->belongsTo(CourseModule::class, 'module_id');
    }

    public function contents()
    {
        return $this->belongsToMany(Content::class, 'unit_contents')
            ->withPivot('order')
            ->withTimestamps();
    }
}
