<?php

namespace App\Console\Commands;

use App\Services\MarketData\MarketDataIngestionService;
use Illuminate\Console\Command;
use RuntimeException;

class ImportNseCorporateActions extends Command
{
    protected $signature = 'equityvault:import-nse-corporate-actions
                            {file : Path to the NSE CSV file}';

    protected $description = 'Import corporate actions from an official NSE CSV export';

    public function handle(
        MarketDataIngestionService $ingestionService
    ): int {
        $file = $this->argument('file');

        if (!is_file($file)) {
            $this->error("CSV file not found: {$file}");

            return self::FAILURE;
        }

        $handle = fopen($file, 'r');

        if ($handle === false) {
            $this->error('Unable to open the CSV file.');

            return self::FAILURE;
        }

        try {
            $headers = fgetcsv($handle);

            if ($headers === false) {
                throw new RuntimeException('CSV file is empty.');
            }

            // Remove UTF-8 BOM and surrounding quotes/whitespace.
            $headers = array_map(
                function ($header) {
                    $header = preg_replace(
                        '/^\xEF\xBB\xBF/',
                        '',
                        $header
                    );

                    return trim(
                        $header,
                        "\" \t\n\r\0\x0B"
                    );
                },
                $headers
            );

            $rows = [];

            while (($data = fgetcsv($handle)) !== false) {
                if (count($data) !== count($headers)) {
                    continue;
                }

                $rows[] = array_combine($headers, $data);
            }

            if (empty($rows)) {
                throw new RuntimeException(
                    'No valid rows were found in the CSV.'
                );
            }

            $this->info(
                'Rows found in NSE CSV: ' . count($rows)
            );

            $results = $ingestionService
                ->ingestCorporateActions($rows);

            $this->info(
                'Corporate actions imported/updated: '
                . count($results)
            );

            $this->newLine();

            foreach ($results as $action) {
                $this->line(
                    "✓ {$action->company->symbol} | "
                    . "{$action->title} | "
                    . "Ex-Date: {$action->ex_date}"
                );
            }

            $this->newLine();

            $this->info(
                'NSE corporate-action import completed.'
            );

            return self::SUCCESS;

        } catch (\Throwable $e) {
            $this->error($e->getMessage());

            return self::FAILURE;

        } finally {
            fclose($handle);
        }
    }
}