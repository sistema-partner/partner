<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

        // Flags adicionais do usuário (passaremos via chave separada caso precise)
        $userMeta = [
            'effective_role' => $effectiveRole,
            'is_viewing_as_student' => $isViewingAsStudent,
            'can_view_as_student' => $user->role === 'teacher' && !$isViewingAsStudent,
        ];

        // Monta estrutura compatível com front existente (auth.user)
        $authPayload = [
            'user' => array_merge(
                $user->only(['id', 'name', 'email', 'role', 'status', 'created_at']),
                $userMeta
            )
        ];

        return Inertia::render('Dashboard', array_merge($dashboardData, [
            'auth' => $authPayload,
        ]));
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
                    ->with([
                        'enrollments' => function ($query) {
                            $query->where('status', 'pending')->with('student');
                        }
                    ])
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
                // Pendências de professores e pesquisadores
                $pendingTeachers = User::whereIn('role', ['teacher', 'researcher'])
                    ->where('status', 'pending')
                    ->get(['id', 'name', 'email', 'role', 'status', 'created_at']);
                $data['teachers'] = $pendingTeachers; // usado no AdminDashboard.jsx
                $data['pending_approvals_count'] = $pendingTeachers->count();
                // Totais de usuários
                $data['total_users'] = User::count();
                $data['recent_users'] = User::latest()->take(5)->get(['id', 'name', 'email', 'role', 'created_at']);
                // Distribuição por role (array simples para o Inertia)
                $data['role_counts'] = User::select('role', DB::raw('count(*) as count'))
                    ->groupBy('role')
                    ->get()
                    ->map(fn($row) => ['role' => $row->role, 'count' => $row->count]);
                break;
        }

        // Garante que role_counts exista (mesmo se não for admin) para evitar undefined no front
        if (!array_key_exists('role_counts', $data)) {
            $data['role_counts'] = collect();
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