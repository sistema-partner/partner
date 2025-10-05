<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Closure;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use function in_array;

class IsProfessorApproved
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, \Closure $next): Response
        {
            if (!Auth::check()) {
                return redirect()->route('login');
            }

            $user = Auth::user();

            // Se for professor ou pesquisador e NÃO aprovado, redireciona
            if (($user->role === 'teacher' || $user->role === 'researcher') && $user->status !== 'approved') {
                return redirect()->route('pending-approval');
            }

            return $next($request);
        }
}
