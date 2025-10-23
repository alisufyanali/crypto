<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// Activity Logs Files
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Permission\Traits\HasRoles;


class Portfolio extends Model
{
    use HasFactory, LogsActivity, HasRoles, SoftDeletes;

    protected $fillable = [
        'user_id', 'company_id', 'shares_owned', 'average_cost', 
        'total_invested', 'current_value', 'unrealized_pnl', 'realized_pnl'
    ];

    protected $casts = [
        'average_cost' => 'decimal:2',
        'total_invested' => 'decimal:2',
        'current_value' => 'decimal:2',
        'unrealized_pnl' => 'decimal:2',
        'realized_pnl' => 'decimal:2',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    // Helper methods
    public function updateCurrentValue()
    {
        $currentPrice = $this->company->getCurrentPrice();
        $this->current_value = $this->shares_owned * $currentPrice;
        $this->unrealized_pnl = $this->current_value - $this->total_invested;
        $this->save();
    }

    public function getTotalPnl()
    {
        return $this->unrealized_pnl + $this->realized_pnl;
    }

    public function getPnlPercentage()
    {
        if ($this->total_invested == 0) return 0;
        return ($this->getTotalPnl() / $this->total_invested) * 100;
    }
    
    // Activity Log Start Here

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('Portfolio')
            ->logOnly([ 'user_id', 'company_id', 'shares_owned', 'average_cost', 
        'total_invested', 'current_value', 'unrealized_pnl', 'realized_pnl'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function getDescriptionForEvent(string $eventName): string
    {
        return "Portfolio record has been {$eventName}";
    }

    // Activity Log End Here
}