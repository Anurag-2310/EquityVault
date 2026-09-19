<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CorporateAction extends Model
{
    protected $fillable = [
        'company_id',
        'action_type',
        'title',
        'description',
        'announcement_date',
        'ex_date',
        'record_date',
        'payment_date',
        'amount',
        'currency',
        'source_exchange',
        'source_url',
        'source_document',
        'fetched_at',
    ];

    protected $casts = [
        'announcement_date' => 'date',
        'ex_date' => 'date',
        'record_date' => 'date',
        'payment_date' => 'date',
        'fetched_at' => 'datetime',
        'amount' => 'decimal:4',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}