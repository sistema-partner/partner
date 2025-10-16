<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentLog extends Model
{
    use HasFactory;

    protected $table = 'enrollments_logs';
    // A tabela possui apenas created_at gerenciado manualmente pela migration
    public $timestamps = false;

    // Colunas reais da tabela enrollments_logs
    protected $fillable = [
        'enrollment_id',
        'action',
        'performed_by',
        'reason',
    ];

    // Relações
    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function performer()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }

    // Scopes
    public function scopeAction($query, $action)
    {
        return $query->where('action', $action);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    // Helpers para ações comuns
    public function isApproval()
    {
        return $this->action === 'approved';
    }

    public function isRejection()
    {
        return $this->action === 'rejected';
    }

    public function isCancellation()
    {
        return $this->action === 'cancelled';
    }

    public function isRequest()
    {
        return $this->action === 'requested';
    }

    public function getActionTextAttribute()
    {
        $actions = [
            'requested' => 'Solicitada',
            'approved' => 'Aprovada',
            'rejected' => 'Rejeitada',
            'cancelled' => 'Cancelada'
        ];

        return $actions[$this->action] ?? $this->action;
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}