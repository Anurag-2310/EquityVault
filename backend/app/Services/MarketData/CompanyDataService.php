<?php

namespace App\Services\MarketData;

use App\Models\Company;

class CompanyDataService
{
    /**
     * Create or update a company using normalized source data.
     *
     * No dummy market data should be inserted here.
     */
    public function upsert(array $data): Company
    {
        return Company::updateOrCreate(
            [
                'symbol' => $data['symbol'],
            ],
            [
                'name' => $data['name'],
                'isin' => $data['isin'] ?? null,
                'nse_symbol' => $data['nse_symbol'] ?? null,
                'bse_code' => $data['bse_code'] ?? null,
                'sector' => $data['sector'] ?? null,
                'industry' => $data['industry'] ?? null,

                'source_exchange' => $data['source_exchange'] ?? null,
                'source_url' => $data['source_url'] ?? null,
                'fetched_at' => now(),
            ]
        );
    }
}