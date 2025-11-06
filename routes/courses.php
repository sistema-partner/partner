<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicCourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\CourseContentController;
use App\Http\Controllers\ContentViewerController;
use App\Http\Controllers\CourseController;

// Exploração e detalhes acessíveis após autenticação e aprovação
Route::middleware(['auth', 'professor.approved'])->group(function () {
    Route::get('/courses/explore', [PublicCourseController::class, 'index'])->name('courses.explore');
    Route::get('/courses/{course}/details', [PublicCourseController::class, 'show'])->name('courses.details');
    Route::post('/courses/enroll-by-code', [EnrollmentController::class, 'enrollByCode'])->name('enrollments.by_code');

    Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'store'])->name('enrollments.store');
    Route::post('/enrollments/{enrollment}/approve', [EnrollmentController::class, 'approve'])->name('enrollments.approve');
    Route::post('/enrollments/{enrollment}/reject', [EnrollmentController::class, 'reject'])->name('enrollments.reject');
    Route::delete('/enrollments/{enrollment}', [EnrollmentController::class, 'destroy'])->name('enrollments.destroy');
});

// Rotas de criação e gestão de cursos para professores verificados
Route::middleware(['auth', 'verified', 'teacher'])->group(function () {
    Route::resource('courses', CourseController::class);
    Route::post('/courses/{course}/contents', [CourseContentController::class, 'store'])->name('courses.contents.store');
    Route::get('/contents/public', [\App\Http\Controllers\PublicContentController::class, 'index'])->name('contents.public');
});

// Visualização interna de conteúdo (qualquer usuário autenticado/verificado aprovado no curso ou autor)
Route::middleware(['auth'])->group(function () {
    Route::get('/contents/{content}', [ContentViewerController::class, 'show'])->name('contents.show');
});
