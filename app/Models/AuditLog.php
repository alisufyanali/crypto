<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;
// Activity Logs Files
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;


class AuditLog extends Model
{
    use HasFactory, LogsActivity, HasRoles, SoftDeletes ;

    protected $fillable = ['user_id', 'action', 'description'];

    // Activity Log Start Here

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('AuditLog')
            ->logOnly(['user_id', 'action', 'description'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function getDescriptionForEvent(string $eventName): string
    {
        return "AuditLog record has been {$eventName}";
    }

    // Activity Log End Here




    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
