<?php

namespace Database\Seeders;

use App\Models\Ipo;
use Illuminate\Database\Seeder;

class IpoSeeder extends Seeder
{
    public function run(): void
    {
        $ipos = [
            [
                'name' => 'National Stock Exchange of India Limited',
                'symbol' => 'NSE',
                'issue_type' => 'Book Building',
                'status' => 'open',
                'open_date' => '2026-09-17',
                'close_date' => '2026-09-21',
                'listing_date' => null,
                'price_band_min' => 1700,
                'price_band_max' => 1785,
                'face_value' => 1,
                'issue_size' => 126436650,
                'issue_size_unit' => 'shares',
                'source_exchange' => 'NSE',
                'source_url' => 'https://www.nseindia.com/market-data/issue-information?series=EQ&symbol=NSE&type=Active',
                'source_document' => 'Official NSE Issue Information',
                'fetched_at' => now(),
            ],

            [
                'name' => 'SpectraA Technology Solutions Limited',
                'symbol' => 'SPECTRAA',
                'issue_type' => 'Book Building',
                'status' => 'open',
                'open_date' => '2026-09-17',
                'close_date' => '2026-09-21',
                'listing_date' => null,
                'price_band_min' => 112,
                'price_band_max' => 118,
                'face_value' => 10,
                'issue_size' => 3603600,
                'issue_size_unit' => 'shares',
                'source_exchange' => 'NSE',
                'source_url' => 'https://www.nseindia.com/market-data/issue-information?series=SME&symbol=SPECTRAA&type=Active',
                'source_document' => 'Official NSE Issue Information',
                'fetched_at' => now(),
            ],

            [
                'name' => 'Sonaselection India Limited',
                'symbol' => 'SONA',
                'issue_type' => 'Book Building',
                'status' => 'open',
                'open_date' => '2026-09-17',
                'close_date' => '2026-09-21',
                'listing_date' => null,
                'price_band_min' => 94,
                'price_band_max' => 99,
                'face_value' => 10,
                'issue_size' => 14300000,
                'issue_size_unit' => 'shares',
                'source_exchange' => 'NSE',
                'source_url' => 'https://www.nseindia.com/market-data/issue-information?series=EQ&symbol=SONA&type=Active',
                'source_document' => 'Official NSE Issue Information',
                'fetched_at' => now(),
            ],
        ];

        foreach ($ipos as $ipo) {
            Ipo::updateOrCreate(
                [
                    'symbol' => $ipo['symbol'],
                ],
                $ipo
            );
        }
    }
}