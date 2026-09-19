<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    /**
     * Get companies.
     */
    public function index(): JsonResponse
    {
        $companies = Company::query()
            ->orderBy('name')
            ->paginate(20);

        return response()->json($companies);
    }

    /**
     * Get a single company.
     */
    public function show(Company $company): JsonResponse
    {
        $company->load([
            'corporateActions',
            'ipos',
            'sourceDocuments',
        ]);

        return response()->json($company);
    }

    /**
     * Create a company.
     *
     * Used for controlled ingestion/admin workflows.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'symbol' => ['required', 'string', 'max:50', 'unique:companies,symbol'],
            'isin' => ['nullable', 'string', 'max:20', 'unique:companies,isin'],
            'nse_symbol' => ['nullable', 'string', 'max:50'],
            'bse_code' => ['nullable', 'string', 'max:20'],
            'sector' => ['nullable', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'source_exchange' => ['nullable', 'string', 'max:50'],
            'source_url' => ['nullable', 'url'],
        ]);

        $company = Company::create($validated);

        return response()->json([
            'message' => 'Company created successfully.',
            'data' => $company,
        ], 201);
    }
}