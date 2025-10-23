<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// Activity Logs Files
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Permission\Traits\HasRoles;


class Stock extends Model
{
    use HasFactory, LogsActivity, HasRoles, SoftDeletes;

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
    
    // Activity Log Start Here

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('Stock')
            ->logOnly([  'company_id', 'current_price', 'previous_close', 'day_high', 
        'day_low', 'volume', 'change_amount', 'change_percentage', 'last_updated'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function getDescriptionForEvent(string $eventName): string
    {
        return "Stock record has been {$eventName}";
    }

    // Activity Log End Here
}