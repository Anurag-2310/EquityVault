<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CorporateAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CorporateActionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CorporateAction::with('company')
            ->orderByDesc('ex_date')
            ->orderByDesc('id');

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('action_type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('company', function ($companyQuery) use ($search) {
                        $companyQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('symbol', 'like', "%{$search}%");
                    });
            });
        }

        $actions = $query->paginate(25);

        return response()->json($actions);
    }

    public function show(CorporateAction $corporateAction): JsonResponse
    {
        $corporateAction->load('company');

        return response()->json($corporateAction);
    }
}