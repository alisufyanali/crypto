<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// Activity Logs Files
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Permission\Traits\HasRoles;


class Order extends Model
{
    use HasFactory, LogsActivity, HasRoles, SoftDeletes;

    protected $fillable = [
        'order_number', 'user_id', 'company_id', 'type', 'quantity', 
        'price_per_share', 'total_amount', 'status', 'notes', 
        'approved_by', 'approved_at', 'executed_by', 'executed_at'
    ];

    protected $casts = [
        'price_per_share' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'approved_at' => 'datetime',
        'executed_at' => 'datetime',
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

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function executedBy()
    {
        return $this->belongsTo(User::class, 'executed_by');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeBuyOrders($query)
    {
        return $query->where('type', 'buy');
    }

    public function scopeSellOrders($query)
    {
        return $query->where('type', 'sell');
    }

    // Helper methods
    public function isBuy()
    {
        return $this->type === 'buy';
    }

    public function isSell()
    {
        return $this->type === 'sell';
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isExecuted()
    {
        return $this->status === 'executed';
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($order) {
            $order->order_number = 'ORD-' . strtoupper(uniqid());
        });
    }
    
    // Activity Log Start Here

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('Order')
            ->logOnly(['order_number', 'user_id', 'company_id', 'type', 'quantity', 
                        'price_per_share', 'total_amount', 'status', 'notes', 
                        'approved_by', 'approved_at', 'executed_by', 'executed_at'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function getDescriptionForEvent(string $eventName): string
    {
        return "Order record has been {$eventName}";
    }

    // Activity Log End Here
}
