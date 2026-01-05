<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_id',
        'student_id',
        'project_url',
        'presentation_url',
        'description',
        'status',
    ];

    public function unit()
    {
        return $this->belongsTo(ModuleUnit::class, 'unit_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
