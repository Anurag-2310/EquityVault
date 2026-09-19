<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CorporateAction;
use App\Models\Ipo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiVaultController extends Controller
{
    public function ask(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:500'],
            'holdings' => ['nullable', 'array'],
            'holdings.*.symbol' => ['nullable', 'string'],
            'holdings.*.shares' => ['nullable', 'numeric', 'min:0'],
            'holdings.*.dividend_per_share' => ['nullable', 'numeric', 'min:0'],
        ]);

        $question = strtolower(trim($validated['question']));
        $holdings = $validated['holdings'] ?? [];

        /*
        |--------------------------------------------------------------------------
        | Expected Dividend
        |--------------------------------------------------------------------------
        */

        if (
            str_contains($question, 'expected dividend') ||
            str_contains($question, 'my dividend') ||
            str_contains($question, 'dividend income')
        ) {
            $total = 0;
            $details = [];

            foreach ($holdings as $holding) {
                $shares = (float) ($holding['shares'] ?? 0);
                $dividend = (float) ($holding['dividend_per_share'] ?? 0);

                $amount = $shares * $dividend;
                $total += $amount;

                $details[] = [
                    'symbol' => $holding['symbol'] ?? '—',
                    'shares' => $shares,
                    'dividend_per_share' => $dividend,
                    'expected_dividend' => $amount,
                ];
            }

            return response()->json([
                'answer' => 'Based on your current holdings and the dividend data stored in EquityVault, your expected dividend is ₹' . number_format($total, 2),
                'type' => 'portfolio_dividend',
                'data' => [
                    'total' => $total,
                    'details' => $details,
                ],
                'source' => 'EquityVault Portfolio + NSE corporate-action data',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | IPO Intelligence
        |--------------------------------------------------------------------------
        */

        if (
            str_contains($question, 'ipo') ||
            str_contains($question, 'public issue') ||
            str_contains($question, 'open issue')
        ) {
            $ipos = Ipo::query()
                ->where('status', 'open')
                ->orderBy('open_date')
                ->get();

            $items = $ipos->map(function ($ipo) {
                return [
                    'name' => $ipo->name,
                    'symbol' => $ipo->symbol,
                    'price_band' => '₹' .
                        number_format($ipo->price_band_min, 0) .
                        ' – ₹' .
                        number_format($ipo->price_band_max, 0),
                    'open_date' => $ipo->open_date,
                    'close_date' => $ipo->close_date,
                    'source' => $ipo->source_exchange,
                ];
            })->values();

            return response()->json([
                'answer' => 'There are currently ' . $items->count() . ' open IPO records in EquityVault.',
                'type' => 'ipo',
                'data' => $items,
                'source' => 'Official NSE issue information imported into EquityVault',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Corporate Actions
        |--------------------------------------------------------------------------
        */

        if (
            str_contains($question, 'corporate action') ||
            str_contains($question, 'corporate actions') ||
            str_contains($question, 'events')
        ) {
            $actions = CorporateAction::query()
                ->with('company')
                ->latest('ex_date')
                ->limit(10)
                ->get();

            $items = $actions->map(function ($action) {
                return [
                    'company' => $action->company?->name,
                    'symbol' => $action->company?->symbol,
                    'type' => $action->action_type,
                    'title' => $action->title,
                    'amount' => $action->amount,
                    'ex_date' => $action->ex_date,
                    'source' => $action->source_exchange,
                ];
            })->values();

            return response()->json([
                'answer' => 'Here are the latest corporate-action records available in EquityVault.',
                'type' => 'corporate_actions',
                'data' => $items,
                'source' => 'NSE corporate-action data',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Dividend Intelligence
        |--------------------------------------------------------------------------
        */

        if (str_contains($question, 'dividend')) {
            $dividends = CorporateAction::query()
                ->with('company')
                ->where('action_type', 'dividend')
                ->latest('ex_date')
                ->limit(10)
                ->get();

            $items = $dividends->map(function ($dividend) {
                return [
                    'company' => $dividend->company?->name,
                    'symbol' => $dividend->company?->symbol,
                    'amount' => $dividend->amount,
                    'ex_date' => $dividend->ex_date,
                    'record_date' => $dividend->record_date,
                    'source' => $dividend->source_exchange,
                ];
            })->values();

            return response()->json([
                'answer' => 'Here are the latest dividend records available in EquityVault.',
                'type' => 'dividend',
                'data' => $items,
                'source' => 'NSE corporate-action data',
            ]);
        }

        return response()->json([
            'answer' => 'I can currently answer questions about your expected dividends, dividends, IPOs, and corporate actions using EquityVault data.',
            'type' => 'help',
            'data' => [],
            'source' => 'EquityVault Intelligence',
        ]);
    }
}