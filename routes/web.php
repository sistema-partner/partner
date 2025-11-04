<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicCourseController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Enrollment;
use App\Http\Controllers\CourseContentController;
use App\Http\Controllers\NotificationController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


// Split route groups into separate files for organization
require __DIR__ . '/dashboard.php';
require __DIR__ . '/profile.php';
require __DIR__ . '/courses.php';
require __DIR__ . '/notifications.php';

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/approvals', [AdminController::class, 'index'])->name('approvals');
    Route::patch('/approve/{user}', [AdminController::class, 'approve'])->name('approve');
    Route::delete('/reject/{user}', [AdminController::class, 'reject'])->name('reject');
});

require __DIR__ . '/auth.php';