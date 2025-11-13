<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Transaction extends Model
{
    use HasFactory, LogsActivity, SoftDeletes;

    protected $fillable = [
        'transaction_id',
        'user_id',
        'order_id',
        'type',
        'amount',
        'adjusted_amount',
        'fees',
        'status',
        'description',
        'comments',
        'admin_notes',
        'metadata',
        'processed_by',
        'processed_at'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'adjusted_amount' => 'decimal:2',
        'fees' => 'decimal:2',
        'metadata' => 'array',
        'processed_at' => 'datetime',
    ];

    // Valid types define karein application level pe
    const TYPE_DEPOSIT = 'deposit';
    const TYPE_WITHDRAWAL = 'withdrawal';
    const TYPE_BUY = 'buy';
    const TYPE_SELL = 'sell';
    const TYPE_DIVIDEND = 'dividend';
    const TYPE_FEE = 'fee';

    const STATUS_PENDING = 'pending';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'failed';
    const STATUS_CANCELLED = 'cancelled';

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function processedBy()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    // Scopes
    public function scopeDeposits($query)
    {
        return $query->where('type', self::TYPE_DEPOSIT);
    }

    public function scopeWithdrawals($query)
    {
        return $query->where('type', self::TYPE_WITHDRAWAL);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    // Helper methods
    public function isDeposit()
    {
        return $this->type === self::TYPE_DEPOSIT;
    }

    public function isWithdrawal()
    {
        return $this->type === self::TYPE_WITHDRAWAL;
    }

    public function isPending()
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isCompleted()
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function getNetAmountAttribute()
    {
        return $this->adjusted_amount ?? $this->amount;
    }

    public function getDisplayAmountAttribute()
    {
        if ($this->adjusted_amount && $this->adjusted_amount != $this->amount) {
            return $this->adjusted_amount;
        }
        return $this->amount;
    }

    // Validation rules for types
    public static function getValidTypes()
    {
        return [
            self::TYPE_DEPOSIT,
            self::TYPE_WITHDRAWAL,
            self::TYPE_BUY,
            self::TYPE_SELL,
            self::TYPE_DIVIDEND,
            self::TYPE_FEE,
        ];
    }

    public static function getValidStatuses()
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_COMPLETED,
            self::STATUS_FAILED,
            self::STATUS_CANCELLED,
        ];
    }

    // Activity Log
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('Transaction')
            ->logOnly(['type', 'amount', 'adjusted_amount', 'fees', 'status', 'comments', 'admin_notes'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function getDescriptionForEvent(string $eventName): string
    {
        return "Transaction record has been {$eventName}";
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($transaction) {
            if (empty($transaction->transaction_id)) {
                $transaction->transaction_id = 'TXN-' . strtoupper(uniqid());
            }
            
            // Default status set karein agar koi status nahi diya gaya hai
            if (empty($transaction->status)) {
                $transaction->status = self::STATUS_PENDING;
            }
            
            // Validate type
            if (!in_array($transaction->type, self::getValidTypes())) {
                throw new \Exception("Invalid transaction type: {$transaction->type}");
            }
            
            // Validate status
            if (!in_array($transaction->status, self::getValidStatuses())) {
                throw new \Exception("Invalid transaction status: {$transaction->status}");
            }
        });

        static::updating(function ($transaction) {
            // Validate status during update
            if (!in_array($transaction->status, self::getValidStatuses())) {
                throw new \Exception("Invalid transaction status: {$transaction->status}");
            }
        });
    }
}