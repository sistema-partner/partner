<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Courses\CourseExploreController;
use App\Http\Controllers\Courses\CourseEnrollmentController;
use App\Http\Controllers\Courses\CourseController;
use App\Http\Controllers\Courses\CourseContentController;
use App\Http\Controllers\Courses\CourseModuleController;
use App\Http\Controllers\Content\ModuleContentController;
use App\Http\Controllers\Content\ContentViewerController;
use App\Http\Controllers\Content\PublicContentController;

// ---- ROTAS PÚBLICAS/EXPLORAÇÃO ----
Route::middleware(['auth', 'professor.approved'])->group(function () {
    Route::get('/courses/explore', [CourseExploreController::class, 'index'])->name('courses.explore');
    Route::get('/courses/{course}', [CourseExploreController::class, 'show'])->name('courses.show');
    
    // Matrículas
    Route::post('/courses/{course}/enroll', [CourseEnrollmentController::class, 'store'])->name('courses.enroll');
    Route::post('/courses/enroll-by-code', [CourseEnrollmentController::class, 'enrollByCode'])->name('enrollments.by_code');
});

// ---- ROTAS DO PROFESSOR (GESTÃO) ----
Route::middleware(['auth', 'verified', 'teacher'])->prefix('teacher/courses')->name('teacher.courses.')->group(function () {
    // CRUD
    Route::get('/', [CourseController::class, 'index'])->name('index');
    Route::get('/create', [CourseController::class, 'create'])->name('create');
    Route::post('/', [CourseController::class, 'store'])->name('store');
    Route::get('/{course}/edit', [CourseController::class, 'edit'])->name('edit');
    Route::put('/{course}', [CourseController::class, 'update'])->name('update');
    Route::delete('/{course}', [CourseController::class, 'destroy'])->name('destroy');
    
    // Dashboard do curso (visão do professor)
    Route::get('/{course}', [CourseController::class, 'show'])->name('show');
    
    // Conteúdos (avisos)
    Route::post('/{course}/contents', [CourseContentController::class, 'store'])->name('contents.store');
    
    // Módulos
    Route::post('/{course}/modules', [CourseModuleController::class, 'store'])->name('modules.store');
    Route::patch('/modules/{module}', [CourseModuleController::class, 'update'])->name('modules.update');
    Route::delete('/modules/{module}', [CourseModuleController::class, 'destroy'])->name('modules.destroy');
});

// ---- ROTAS DE CONTEÚDO ----
Route::middleware(['auth'])->group(function () {
    // Conteúdo em módulos
    Route::post('/modules/{module}/contents', [ModuleContentController::class, 'store'])->name('modules.contents.store');
    Route::patch('/contents/{content}', [ModuleContentController::class, 'update'])->name('contents.update');
    Route::delete('/modules/{module}/contents/{content}', [ModuleContentController::class, 'destroy'])->name('modules.contents.destroy');
    
    // Visualização
    Route::get('/contents/{content}', [ContentViewerController::class, 'show'])->name('contents.show');
    
    // Conteúdo público
    Route::get('/contents/public', [PublicContentController::class, 'index'])->name('contents.public');
});

// ---- ADMINISTRAÇÃO DE MATRÍCULAS ----
Route::middleware(['auth'])->prefix('enrollments')->name('enrollments.')->group(function () {
    Route::post('/{enrollment}/approve', [CourseEnrollmentController::class, 'approve'])->name('approve');
    Route::post('/{enrollment}/reject', [CourseEnrollmentController::class, 'reject'])->name('reject');
    Route::delete('/{enrollment}', [CourseEnrollmentController::class, 'destroy'])->name('destroy');
});