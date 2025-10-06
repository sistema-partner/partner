<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Rotas públicas
Route::get('/pending-approval', function() {
    return Inertia::render('Auth/PendingApproval');
})->middleware(['auth'])->name('pending-approval');

// Rotas protegidas
Route::middleware(['auth', 'verified', 'professor.approved'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'user' => auth()->user(),
            'enrolled_courses' => auth()->user()->enrolledCourses ?? [],
            'pending_enrollments' => auth()->user()->pendingEnrollments ?? [],
            'taught_courses' => auth()->user()->taughtCourses ?? [],
            'pending_approvals' => auth()->user()->pendingApprovals ?? [],
            'research_groups' => auth()->user()->researchGroups ?? [],
            'analytics' => auth()->user()->analytics ?? [],
            'pending_approvals_count' => auth()->user()->pendingApprovalsCount ?? 0,
            'total_users' => auth()->user()->totalUsers ?? 0,
            'recent_users' => auth()->user()->recentUsers ?? [],
        ]);
    })->name('dashboard');

    Route::get('/professor', function() {
        return Inertia::render('Teacher/Dashboard');
    })->name('teacher.dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rotas de admin
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/approvals', [AdminController::class, 'index'])->name('admin.approvals');
    Route::patch('/approve/{user}', [AdminController::class, 'approve'])->name('admin.approve');
    Route::delete('/reject/{user}', [AdminController::class, 'reject'])->name('admin.reject');
});

require __DIR__.'/auth.php';