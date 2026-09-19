<?php

namespace Database\Seeders;

use App\Models\SourceDocument;
use Illuminate\Database\Seeder;

class SourceDocumentSeeder extends Seeder
{
    public function run(): void
    {
        // Remove old/duplicate generic NSE Issue Information record
        SourceDocument::where(
            'document_url',
            'https://www.nseindia.com/market-data/issue-information'
        )->delete();

        $documents = [
            [
                'company_id' => null,
                'document_type' => 'Corporate Actions',
                'title' => 'NSE Corporate Filings and Actions',
                'document_url' => 'https://www.nseindia.com/companies-listing/corporate-filings-actions',
                'file_type' => 'Web Source',
                'source_exchange' => 'NSE',
                'source_name' => 'National Stock Exchange of India',
                'published_at' => null,
                'fetched_at' => now(),
            ],

            [
                'company_id' => null,
                'document_type' => 'IPO Information',
                'title' => 'NSE Issue Information',
                'document_url' => 'https://www.nseindia.com/market-data/issue-information?series=EQ&symbol=NSE&type=Active',
                'file_type' => 'Web Source',
                'source_exchange' => 'NSE',
                'source_name' => 'National Stock Exchange of India',
                'published_at' => null,
                'fetched_at' => now(),
            ],

            [
                'company_id' => null,
                'document_type' => 'Data Policy',
                'title' => 'NSE Data Policy',
                'document_url' => 'https://www.nseindia.com/static/market-data/nse-data-policy',
                'file_type' => 'Web Source',
                'source_exchange' => 'NSE',
                'source_name' => 'National Stock Exchange of India',
                'published_at' => null,
                'fetched_at' => now(),
            ],

            [
                'company_id' => null,
                'document_type' => 'Corporate Actions',
                'title' => 'NSE Investor Relations - Corporate Actions',
                'document_url' => 'https://www.nseindia.com/static/investor-relations/corporate-actions',
                'file_type' => 'Web Source',
                'source_exchange' => 'NSE',
                'source_name' => 'National Stock Exchange of India',
                'published_at' => null,
                'fetched_at' => now(),
            ],
        ];

        foreach ($documents as $document) {
            SourceDocument::updateOrCreate(
                [
                    'document_url' => $document['document_url'],
                ],
                $document
            );
        }
    }
}