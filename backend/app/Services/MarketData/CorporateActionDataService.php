<?php

namespace App\Services\MarketData;

use App\Models\Company;
use App\Models\CorporateAction;

class CorporateActionDataService
{
    /**
     * Store normalized corporate-action data.
     *
     * No dummy data should be inserted here.
     */
    public function upsert(array $data): CorporateAction
    {
        $company = Company::where('symbol', $data['symbol'])->first();

        if (!$company) {
            throw new \RuntimeException(
                "Company with symbol {$data['symbol']} does not exist."
            );
        }

        return CorporateAction::updateOrCreate(
            [
                'company_id' => $company->id,
                'action_type' => $data['action_type'],
                'title' => $data['title'],
                'ex_date' => $data['ex_date'],
            ],
            [
                'description' => $data['description'] ?? null,
                'announcement_date' => $data['announcement_date'] ?? null,
                'record_date' => $data['record_date'] ?? null,
                'payment_date' => $data['payment_date'] ?? null,
                'amount' => $data['amount'] ?? null,
                'currency' => $data['currency'] ?? 'INR',

                'source_exchange' =>
                    $data['source_exchange'] ?? null,

                'source_url' =>
                    $data['source_url'] ?? null,

                'source_document' =>
                    $data['source_document'] ?? null,

                'fetched_at' =>
                    $data['fetched_at'] ?? now(),
            ]
        );
    }
}