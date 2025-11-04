<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Enrollment;
use App\Http\Controllers\DashboardController;

Route::middleware(['auth', 'professor.approved'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/pending-approval', function () {
        return Inertia::render('Auth/PendingApproval');
    })->name('pending-approval');

    // Alternar visão professor -> estudante e voltar
    Route::post('/dashboard/view-as-student', [DashboardController::class, 'viewAsStudent'])->name('view-as-student');
    Route::post('/dashboard/view-normal', [DashboardController::class, 'viewNormal'])->name('view-normal');
});

// Rotas de dashboard específicas de teacher
Route::middleware(['auth', 'verified', 'teacher'])->group(function () {
    Route::get('/teacher/dashboard', function () {
        return Inertia::render('Teacher/Dashboard');
    })->name('teacher.dashboard');
});
