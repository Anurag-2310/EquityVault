<?php

namespace App\Services\MarketData;

use Carbon\Carbon;

class NseCorporateActionSource
{
    /**
     * Normalize corporate-action rows coming from
     * an official NSE CSV/export.
     *
     * No dummy data is generated here.
     */
    public function normalize(array $rows): array
    {
        $normalized = [];

        foreach ($rows as $row) {
            $symbol = trim(
                $row['SYMBOL']
                ?? $row['Symbol']
                ?? $row['symbol']
                ?? ''
            );

            $purpose = trim(
                $row['PURPOSE']
                ?? $row['Purpose']
                ?? $row['purpose']
                ?? ''
            );

            if ($symbol === '' || $purpose === '') {
                continue;
            }

            $normalized[] = [
                'symbol' => $symbol,

                'company_name' => trim(
                    $row['COMPANY NAME']
                    ?? $row['COMPANY_NAME']
                    ?? $row['Company Name']
                    ?? $row['company_name']
                    ?? ''
                ),

                'title' => $purpose,

                'action_type' => $this->detectActionType($purpose),

                'description' => $purpose,

                'announcement_date' => $this->parseDate(
                    $row['ANNOUNCEMENT_DATE']
                    ?? $row['Announcement Date']
                    ?? null
                ),

                'ex_date' => $this->parseDate(
                    $row['EX-DATE']
                    ?? $row['EX DATE']
                    ?? $row['Ex Date']
                    ?? $row['ex_date']
                    ?? null
                ),

                'record_date' => $this->parseDate(
                    $row['RECORD DATE']
                    ?? $row['RECORD_DATE']
                    ?? $row['Record Date']
                    ?? $row['record_date']
                    ?? null
                ),

                'payment_date' => null,

                'amount' => $this->extractAmount($purpose),

                'currency' => 'INR',

                'source_exchange' => 'NSE',

                'source_url' => $row['SOURCE_URL'] ?? null,

                'source_document' => $row['SOURCE_DOCUMENT'] ?? null,

                'fetched_at' => now(),
            ];
        }

        return $normalized;
    }

    /**
     * Detect the corporate-action category.
     */
    private function detectActionType(string $purpose): string
    {
        $text = strtolower($purpose);

        if (str_contains($text, 'dividend')) {
            return 'dividend';
        }

        if (str_contains($text, 'bonus')) {
            return 'bonus';
        }

        if (
            str_contains($text, 'split') ||
            str_contains($text, 'sub-division') ||
            str_contains($text, 'sub division')
        ) {
            return 'split';
        }

        if (str_contains($text, 'rights')) {
            return 'rights';
        }

        if (str_contains($text, 'buyback')) {
            return 'buyback';
        }

        return 'other';
    }

    /**
     * Extract dividend amount when present.
     *
     * Example:
     * "Dividend - Rs 31 Per Share"
     * => 31
     */
    private function extractAmount(string $purpose): ?float
    {
        if (
            preg_match(
                '/(?:rs\.?|₹)\s*([0-9]+(?:\.[0-9]+)?)/i',
                $purpose,
                $matches
            )
        ) {
            return (float) $matches[1];
        }

        return null;
    }

    /**
     * Convert different date formats into YYYY-MM-DD.
     */
    private function parseDate(?string $date): ?string
    {
        if (!$date) {
            return null;
        }

        $date = trim($date);

        if ($date === '' || $date === '-') {
            return null;
        }

        try {
            return Carbon::parse($date)->format('Y-m-d');
        } catch (\Throwable) {
            return null;
        }
    }
}