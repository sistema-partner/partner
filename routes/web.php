<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController; 

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/professor', function() {
    return Inertia::render('Teacher/Dashboard');
})->middleware(['auth', 'professor.approved']);

Route::get('/pending-approval', function() {
    return Inertia::render('Auth/PendingApproval');
})->middleware(['auth'])->name('pending-approval');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/admin/approvals', [AdminController::class, 'index'])->middleware('admin');

Route::patch('/admin/approve/{user}', [AdminController::class, 'approve'])->middleware(['auth', 'admin'])->name('admin.approve');
Route::delete('/admin/reject/{user}', [AdminController::class, 'reject'])->middleware(['auth', 'admin'])->name('admin.reject');



require __DIR__.'/auth.php';
