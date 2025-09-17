<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Stock extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'company_id', 'current_price', 'previous_close', 'day_high', 
        'day_low', 'volume', 'change_amount', 'change_percentage', 'last_updated'
    ];

    protected $casts = [
        'current_price' => 'decimal:2',
        'previous_close' => 'decimal:2',
        'day_high' => 'decimal:2',
        'day_low' => 'decimal:2',
        'change_amount' => 'decimal:2',
        'change_percentage' => 'decimal:2',
        'last_updated' => 'datetime',
    ];

    // Relationships
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}