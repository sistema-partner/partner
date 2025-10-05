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

        // Permite acesso a estudantes
        if ($user->role === 'student') {
            return $next($request);
        }

        // Se for professor/pesquisador e NÃO aprovado, redireciona
        if (in_array($user->role, ['teacher', 'researcher']) && $user->status !== 'approved') {
            return redirect()->route('pending-approval');
        }

        return $next($request);
    }
}