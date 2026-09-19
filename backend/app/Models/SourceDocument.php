<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SourceDocument extends Model
{
    protected $fillable = [
        'company_id',
        'document_type',
        'title',
        'document_url',
        'file_type',
        'source_exchange',
        'source_name',
        'published_at',
        'fetched_at',
        'document_hash',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'fetched_at' => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}