<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ipo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IpoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Ipo::query()
            ->with('company')
            ->orderByRaw("
                CASE status
                    WHEN 'open' THEN 1
                    WHEN 'upcoming' THEN 2
                    WHEN 'closed' THEN 3
                    WHEN 'listed' THEN 4
                    ELSE 5
                END
            ")
            ->orderBy('open_date');

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('symbol', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json(
            $query->paginate(20)
        );
    }

    public function show(Ipo $ipo): JsonResponse
    {
        return response()->json(
            $ipo->load('company')
        );
    }
}