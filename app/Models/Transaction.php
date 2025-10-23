<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// Activity Logs Files
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Permission\Traits\HasRoles;


class Transaction extends Model
{
    use HasFactory, LogsActivity, HasRoles, SoftDeletes;

    protected $fillable = [
        'transaction_id', 'user_id', 'order_id', 'type', 
        'amount', 'description', 'metadata'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'metadata' => 'array',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($transaction) {
            $transaction->transaction_id = 'TXN-' . strtoupper(uniqid());
        });
    }

    // Activity Log Start Here

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('Transaction')
            ->logOnly([  'transaction_id', 'user_id', 'order_id', 'type',  'amount', 'description', 'metadata'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function getDescriptionForEvent(string $eventName): string
    {
        return "Transaction record has been {$eventName}";
    }

    // Activity Log End Here

}