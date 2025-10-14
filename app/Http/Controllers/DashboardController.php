<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Course;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Verifica se está em modo "ver como aluno"
        $isViewingAsStudent = session('viewing_as_student', false);
        $effectiveRole = $isViewingAsStudent ? 'student' : $user->role;
        
        // Busca dados específicos baseado na role efetiva
        $dashboardData = $this->getDashboardData($user, $effectiveRole);
        
        return Inertia::render('Dashboard', [
            'user' => [
                ...$user->toArray(),
                'effective_role' => $effectiveRole,
                'is_viewing_as_student' => $isViewingAsStudent,
                'can_view_as_student' => $user->role === 'teacher' && !$isViewingAsStudent,
            ],
            ...$dashboardData
        ]);
    }
    
    private function getDashboardData($user, $effectiveRole)
    {
        $data = [];
        
        switch ($effectiveRole) {
            case 'student':
                $data['enrolled_courses'] = $user->enrollments()
                    ->with('course')
                    ->where('status', 'approved')
                    ->get()
                    ->pluck('course');
                
                $data['pending_enrollments'] = $user->enrollments()
                    ->with('course')
                    ->where('status', 'pending')
                    ->get();
                break;
                
            case 'teacher':
                $data['taught_courses'] = $user->taughtCourses()
                    ->withCount(['enrollments', 'activeEnrollments'])
                    ->get();
                
                $data['pending_approvals'] = $user->taughtCourses()
                    ->with(['enrollments' => function($query) {
                        $query->where('status', 'pending')->with('student');
                    }])
                    ->get()
                    ->pluck('enrollments')
                    ->flatten();
                break;
                
            case 'researcher':
                // Dados específicos de pesquisador
                $data['research_groups'] = []; // Implementar conforme necessidade
                $data['analytics'] = []; // Dados analíticos
                break;
                
            case 'admin':
                $data['pending_approvals_count'] = User::where('status', 'pending')->count();
                $data['total_users'] = User::count();
                $data['recent_users'] = User::latest()->take(5)->get();
                break;
        }
        
        return $data;
    }
    
    public function viewAsStudent()
    {
        $user = Auth::user();
        
        if ($user->role !== 'teacher') {
            return redirect()->route('dashboard')->with('error', 'Apenas professores podem usar esta função.');
        }
        
        // Ativa o modo "ver como aluno"
        session(['viewing_as_student' => true]);
        
        return redirect()->route('dashboard')->with('success', 'Agora você está vendo o dashboard como um aluno.');
    }
    
    public function viewNormal()
    {
        // Desativa o modo "ver como aluno"
        session()->forget('viewing_as_student');
        
        return redirect()->route('dashboard')->with('success', 'Voltando à sua visão normal.');
    }
}