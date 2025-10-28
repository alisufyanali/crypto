<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

// Activity Logs Files
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Permission\Traits\HasRoles;

class Blog extends Model
{
    use HasFactory, LogsActivity, HasRoles, SoftDeletes;

    protected $fillable = ['name', 'slug', 'description', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    // Activity Log Start Here

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('Blog')
            ->logOnly(['name', 'slug', 'description', 'user_id'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function getDescriptionForEvent(string $eventName): string
    {
        return "Blog record has been {$eventName}";
    }

    // Activity Log End Here
}
