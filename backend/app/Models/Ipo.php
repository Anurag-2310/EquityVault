<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ipo extends Model
{
    protected $fillable = [
        'company_id',
        'name',
        'symbol',
        'issue_type',
        'status',
        'open_date',
        'close_date',
        'listing_date',
        'price_band_min',
        'price_band_max',
        'face_value',
        'issue_size',
        'issue_size_unit',
        'source_exchange',
        'source_url',
        'source_document',
        'fetched_at',
    ];

    protected $casts = [
        'open_date' => 'date',
        'close_date' => 'date',
        'listing_date' => 'date',
        'fetched_at' => 'datetime',
        'price_band_min' => 'decimal:4',
        'price_band_max' => 'decimal:4',
        'face_value' => 'decimal:4',
        'issue_size' => 'decimal:4',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}