<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class IsProfessorApproved
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // Permite acesso se estiver em modo "ver como aluno"
        if (session('viewing_as_student')) {
            return $next($request);
        }

        // Lógica normal de aprovação
        if (in_array($user->role, ['teacher', 'researcher']) && $user->status !== 'approved') {
            return redirect()->route('pending-approval');
        }

        return $next($request);
    }


}