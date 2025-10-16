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


Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();
        $props = [];

        switch ($user->role) {
            case 'student':
                $allEnrollments = $user->enrollments()->with(['course.teacher'])->get();

                $props['enrolled_courses'] = $allEnrollments->where('status', 'approved')->pluck('course');
                
                $props['pending_enrollments'] = $allEnrollments->where('status', 'pending');
                break;

            case 'teacher':
                $props['taught_courses'] = $user->taughtCourses()->withCount('activeEnrollments')->get();
                $props['pending_approvals'] = Enrollment::whereIn('course_id', $user->taughtCourses()->pluck('id'))
                                                        ->where('status', 'pending')
                                                        ->with('student', 'course')
                                                        ->get();
                break;
            
        }

        return Inertia::render('Dashboard', $props);

    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/courses/explore', [PublicCourseController::class, 'index'])->name('courses.explore');
    Route::get('/courses/{course}/details', [PublicCourseController::class, 'show'])->name('courses.details');

    Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'store'])->name('enrollments.store');
    Route::post('/enrollments/{enrollment}/approve', [EnrollmentController::class, 'approve'])->name('enrollments.approve');
    Route::post('/enrollments/{enrollment}/reject', [EnrollmentController::class, 'reject'])->name('enrollments.reject');
    Route::delete('/enrollments/{enrollment}', [EnrollmentController::class, 'destroy'])->name('enrollments.destroy');

    Route::get('/pending-approval', function() {
        return Inertia::render('Auth/PendingApproval');
    })->name('pending-approval');
});


Route::middleware(['auth', 'verified', 'teacher'])->group(function() {
    Route::get('/teacher/dashboard', function() {
        return Inertia::render('Teacher/Dashboard');
    })->name('teacher.dashboard');
    
    Route::resource('courses', CourseController::class);
    Route::post('/courses/{course}/contents', [CourseContentController::class, 'store'])->name('courses.contents.store');
});


Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/approvals', [AdminController::class, 'index'])->name('approvals');
    Route::patch('/approve/{user}', [AdminController::class, 'approve'])->name('approve');
    Route::delete('/reject/{user}', [AdminController::class, 'reject'])->name('reject');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
});

require __DIR__.'/auth.php';