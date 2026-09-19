<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SourceDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SourceDocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SourceDocument::query()
            ->with('company')
            ->latest('published_at')
            ->latest('created_at');

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('source_name', 'like', "%{$search}%")
                    ->orWhere('document_type', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $query->paginate(20)
        );
    }

    public function show(SourceDocument $sourceDocument): JsonResponse
    {
        return response()->json(
            $sourceDocument->load('company')
        );
    }
}