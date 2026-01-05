<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentContentProgress extends Model
{
    use HasFactory;

    protected $table = 'enrollment_content_progress';

    public $timestamps = false;

    protected $fillable = [
        'enrollment_id',
        'unit_content_id',
        'completed',
        'completed_at',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function unitContent()
    {
        return $this->belongsTo(UnitContent::class, 'unit_content_id');
    }
}
