<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
        {
            $pendingTeachers = User::where('role', 'teacher')
                                ->where('status', 'pending')
                                ->get();

            return Inertia::render('Admin/Approvals', [
                'teachers' => $pendingTeachers
            ]);
        }
    public function approve(User $user)
        {
            $user->update(['status' => 'approved']);
            return back()->with('status', 'Professor aprovado com sucesso!');
        }

    public function reject(User $user)
        {
            $user->delete();
            return back()->with('status', 'Professor rejeitado com sucesso!');
        }
}
