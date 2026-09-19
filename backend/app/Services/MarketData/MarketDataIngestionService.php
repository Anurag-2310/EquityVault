<?php

namespace App\Services\MarketData;

class MarketDataIngestionService
{
    public function __construct(
        private CompanyDataService $companyDataService,
        private CorporateActionDataService $corporateActionDataService,
        private NseCorporateActionSource $nseCorporateActionSource,
    ) {
    }

    /**
     * Ingest normalized NSE corporate-action data.
     *
     * Company information must come from the source data.
     */
    public function ingestCorporateActions(array $rows): array
    {
        $normalizedRows = $this->nseCorporateActionSource
            ->normalize($rows);

        $results = [];

        foreach ($normalizedRows as $row) {

            if (empty($row['company_name'])) {
                throw new \RuntimeException(
                    "Company name is required for {$row['symbol']}."
                );
            }

            $company = $this->companyDataService->upsert([
                'name' => $row['company_name'],
                'symbol' => $row['symbol'],
                'nse_symbol' => $row['symbol'],
                'isin' => $row['isin'] ?? null,
                'bse_code' => $row['bse_code'] ?? null,

                'source_exchange' => 'NSE',
                'source_url' => $row['source_url'] ?? null,
                'fetched_at' => $row['fetched_at'] ?? now(),
            ]);

            $row['symbol'] = $company->symbol;

            $results[] = $this->corporateActionDataService
                ->upsert($row);
        }

        return $results;
    }
}