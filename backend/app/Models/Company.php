<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = [
        'name',
        'symbol',
        'isin',
        'nse_symbol',
        'bse_code',
        'sector',
        'industry',
        'source_exchange',
        'source_url',
        'fetched_at',
    ];

    protected $casts = [
        'fetched_at' => 'datetime',
    ];

    public function corporateActions(): HasMany
    {
        return $this->hasMany(CorporateAction::class);
    }

    public function ipos(): HasMany
    {
        return $this->hasMany(Ipo::class);
    }

    public function sourceDocuments(): HasMany
    {
        return $this->hasMany(SourceDocument::class);
    }
}