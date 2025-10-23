<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// Activity Logs Files
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Permission\Traits\HasRoles;

class AccountBalance extends Model
{
    use HasFactory, LogsActivity, HasRoles, SoftDeletes;

    protected $fillable = [
        'user_id', 'cash_balance', 'invested_amount', 
        'total_portfolio_value', 'total_pnl'
    ];

    protected $casts = [
        'cash_balance' => 'decimal:2',
        'invested_amount' => 'decimal:2',
        'total_portfolio_value' => 'decimal:2',
        'total_pnl' => 'decimal:2',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Helper methods
    public function getTotalAccountValue()
    {
        return $this->cash_balance + $this->total_portfolio_value;
    }

    public function updateFromPortfolio()
    {
        $portfolios = $this->user->portfolio;
        
        $this->invested_amount = $portfolios->sum('total_invested');
        $this->total_portfolio_value = $portfolios->sum('current_value');
        $this->total_pnl = $portfolios->sum('unrealized_pnl') + $portfolios->sum('realized_pnl');
        
        $this->save();
    }
    
    // Activity Log Start Here

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('AccountBalance')
            ->logOnly(['user_id', 'cash_balance', 'invested_amount', 
        'total_portfolio_value', 'total_pnl'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function getDescriptionForEvent(string $eventName): string
    {
        return "AccountBalance record has been {$eventName}";
    }

    // Activity Log End Here
}

