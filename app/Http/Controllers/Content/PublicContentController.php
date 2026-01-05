<?php

namespace App\Http\Controllers\Content;
use App\Http\Controllers\Controller;

use App\Models\Content;
use Illuminate\Http\Request;

class PublicContentController extends Controller
{
    public function index(Request $request)
    {
        $query = Content::public()
            ->with(['user:id,name'])
            ->withCount([
                'ratings as average_rating' => function ($q) {
                    $q->selectRaw('coalesce(avg(stars),0)');
                }
            ])
            ->orderBy('view_count', 'desc')
            ->orderBy('download_count', 'desc')
            ->limit(50);

        if ($search = $request->get('search')) {
            $query->where('title', 'like', '%' . $search . '%');
        }

        $contents = $query->get()->map(fn($c) => [
            'id' => $c->id,
            'title' => $c->title,
            'type' => $c->type,
            'author' => $c->user?->name,
            'average_rating' => round($c->average_rating, 2),
            'view_count' => $c->view_count,
            'download_count' => $c->download_count,
        ]);

        return response()->json(['contents' => $contents]);
    }
}
