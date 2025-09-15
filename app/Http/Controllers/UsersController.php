<?php

namespace App\Http\Controllers;
use Inertia\Inertia;

use Illuminate\Http\Request;

class UsersController extends Controller
{
    //
    public function index(){
        return Inertia::render("Home/TestPage");
    }
}
