<?php

use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\CorporateActionController;
use App\Http\Controllers\Api\IpoController;
use App\Http\Controllers\Api\AiVaultController;
use App\Http\Controllers\Api\SourceDocumentController;
use Illuminate\Support\Facades\Route;

Route::get('/companies', [CompanyController::class, 'index']);
Route::get('/companies/{company}', [CompanyController::class, 'show']);
Route::post('/companies', [CompanyController::class, 'store']);

Route::get('/corporate-actions', [CorporateActionController::class, 'index']);
Route::get('/corporate-actions/{corporateAction}', [CorporateActionController::class, 'show']);

Route::get('/ipos', [IpoController::class, 'index']);
Route::get('/ipos/{ipo}', [IpoController::class, 'show']);

Route::post('/ai/ask', [AiVaultController::class, 'ask']);

Route::get('/documents', [SourceDocumentController::class, 'index']);
Route::get('/documents/{sourceDocument}', [SourceDocumentController::class, 'show']);