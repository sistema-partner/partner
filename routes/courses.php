<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Courses\CourseExploreController;
use App\Http\Controllers\Courses\CourseEnrollmentController;
use App\Http\Controllers\Courses\CourseController;
use App\Http\Controllers\Courses\CourseModuleController;
use App\Http\Controllers\Courses\ModuleUnitController;
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

Route::middleware(['auth', 'verified', 'teacher'])
    ->prefix('teacher/courses')
    ->name('teacher.courses.')
    ->group(function () {

        // LISTAGEM
        Route::get('/', [CourseController::class, 'index'])->name('index');

        // CRIAÇÃO
        Route::get('/create', [CourseController::class, 'create'])->name('create');
        Route::post('/', [CourseController::class, 'store'])->name('store');

        // VISÃO GERAL
        Route::get('/{course}', [CourseController::class, 'show'])->name('show');

        // WIZARD
        Route::get('/{course}/about', [CourseController::class, 'about'])->name('about');
        Route::post('/{course}/about', [CourseController::class, 'updateAbout'])->name('about.update');

        Route::get('/{course}/settings', [CourseController::class, 'settings'])->name('settings');
        Route::put('/{course}/settings', [CourseController::class, 'updateSettings'])->name('settings.update');

        Route::get('/{course}/curriculum', [CourseController::class, 'curriculum'])->name('curriculum');
        Route::patch('/{course}/curriculum', [CourseController::class, 'updateCurriculum'])->name('curriculum.update');

        Route::get('/{course}/publish', [CourseController::class, 'publish'])->name('publish');

        Route::delete('/{course}', [CourseController::class, 'destroy'])->name('destroy');
    });

Route::middleware(['auth', 'teacher'])
    ->prefix('teacher')
    ->name('teacher.')
    ->group(function () {

        // MÓDULOS
        Route::post('/courses/{course}/modules', [CourseModuleController::class, 'store'])
            ->name('modules.store');

        Route::patch('/modules/{module}', [CourseModuleController::class, 'update'])
            ->name('modules.update');

        Route::patch('/courses/{course}/modules/reorder', [CourseModuleController::class, 'reorder'])
            ->name('modules.reorder');

        Route::delete('/modules/{module}', [CourseModuleController::class, 'destroy'])
            ->name('modules.destroy');
        // UNIDADES
        Route::post('/modules/{module}/units', [ModuleUnitController::class, 'store'])
            ->name('units.store');

        Route::patch('/units/{unit}', [ModuleUnitController::class, 'update'])
            ->name('units.update');

        Route::patch('/modules/{module}/units/reorder', [ModuleUnitController::class, 'reorder'])
            ->name('units.reorder');

        Route::delete('/units/{unit}', [ModuleUnitController::class, 'destroy'])
            ->name('units.destroy');
    });


// ---- ROTAS DE CONTEÚDO ----
Route::middleware(['auth'])->group(function () {

    // UNIDADES → CONTEÚDOS
    Route::post('/units/{unit}/contents', [ModuleContentController::class, 'store'])
        ->name('units.contents.store');

    Route::patch('/unit-contents/{unitContent}', [ModuleContentController::class, 'update'])
        ->name('unit-contents.update');

    Route::delete('/unit-contents/{unitContent}', [ModuleContentController::class, 'destroy'])
        ->name('unit-contents.destroy');

    // VISUALIZAÇÃO
    Route::get('/contents/{content}', [ContentViewerController::class, 'show'])
        ->name('contents.show');

    // CONTEÚDO PÚBLICO
    Route::get('/contents/public', [PublicContentController::class, 'index'])
        ->name('contents.public');
});


// ---- ADMINISTRAÇÃO DE MATRÍCULAS ----
Route::middleware(['auth'])->prefix('enrollments')->name('enrollments.')->group(function () {
    Route::post('/{enrollment}/approve', [CourseEnrollmentController::class, 'approve'])->name('approve');
    Route::post('/{enrollment}/reject', [CourseEnrollmentController::class, 'reject'])->name('reject');
    Route::delete('/{enrollment}', [CourseEnrollmentController::class, 'destroy'])->name('destroy');
});