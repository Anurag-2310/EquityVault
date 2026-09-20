<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CorporateAction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class LiveDataSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/live_data.json');

        if (!File::exists($path)) {
            $this->command->error('live_data.json not found.');
            return;
        }

        $data = json_decode(File::get($path), true);

        if (!is_array($data)) {
            $this->command->error('Invalid JSON data.');
            return;
        }

        foreach ($data as $companyData) {
            $corporateActions = $companyData['corporate_actions'] ?? [];

            unset($companyData['corporate_actions']);

            $company = Company::updateOrCreate(
                [
                    'symbol' => $companyData['symbol'],
                ],
                $companyData
            );

            foreach ($corporateActions as $actionData) {
                unset(
                    $actionData['id'],
                    $actionData['company_id'],
                    $actionData['created_at'],
                    $actionData['updated_at']
                );

                CorporateAction::updateOrCreate(
                    [
                        'company_id' => $company->id,
                        'action_type' => $actionData['action_type'],
                        'title' => $actionData['title'],
                        'ex_date' => $actionData['ex_date'],
                    ],
                    array_merge(
                        $actionData,
                        [
                            'company_id' => $company->id,
                        ]
                    )
                );
            }
        }

        $this->command->info('Live company and corporate-action data imported successfully.');
    }
}