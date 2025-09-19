<?php

// app/Models/Company.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'symbol', 'description', 'sector', 
        'market_cap', 'shares_outstanding', 'logo_path', 'is_active'
    ];

    protected $casts = [
        'market_cap' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function currentStock()
    {
        return $this->hasOne(Stock::class)->latest();
    } 

    protected static function booted()
    {
        static::deleting(function ($company) {
            $company->stocks()->delete();
            $company->stockPrices()->delete();
        });
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function stockPrices()
    {
        return $this->hasMany(StockPrice::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function portfolios()
    {
        return $this->hasMany(Portfolio::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Helper methods
    public function getCurrentPrice()
    {
        return $this->currentStock?->current_price ?? 0;
    }

    public function getPriceChange()
    {
        $current = $this->currentStock;
        return [
            'amount' => $current?->change_amount ?? 0,
            'percentage' => $current?->change_percentage ?? 0,
        ];
    }
}