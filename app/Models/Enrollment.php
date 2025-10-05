<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'course_id',
        'status',
        'requested_at',
        'approved_at',
        'approved_by',
        'cancelled_at',
        'cancellation_reason'
    ];

    protected $casts = [
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    // Relações
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function logs()
    {
        return $this->hasMany(EnrollmentLog::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    // Helpers
    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isApproved()
    {
        return $this->status === 'approved';
    }

    public function isRejected()
    {
        return $this->status === 'rejected';
    }

    public function isCancelled()
    {
        return $this->status === 'cancelled';
    }

    public function canBeCancelled()
    {
        // Pode cancelar até 3 dias após a aprovação
        if ($this->isApproved() && $this->approved_at) {
            return $this->approved_at->diffInDays(now()) <= 3;
        }
        
        // Ou se ainda estiver pendente
        return $this->isPending();
    }

    public function approve($approverId)
    {
        $this->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $approverId
        ]);

        // Log da ação
        EnrollmentLog::create([
            'enrollment_id' => $this->id,
            'action' => 'approved',
            'performed_by' => $approverId
        ]);
    }

    public function reject($rejecterId, $reason = null)
    {
        $this->update([
            'status' => 'rejected',
            'approved_by' => $rejecterId
        ]);

        EnrollmentLog::create([
            'enrollment_id' => $this->id,
            'action' => 'rejected',
            'performed_by' => $rejecterId,
            'reason' => $reason
        ]);
    }

    public function cancel($cancellerId, $reason = null)
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $reason
        ]);

        EnrollmentLog::create([
            'enrollment_id' => $this->id,
            'action' => 'cancelled',
            'performed_by' => $cancellerId,
            'reason' => $reason
        ]);
    }
}