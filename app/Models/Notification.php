<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'role',
        'type',
        'title',
        'message',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * ✅ Scope for user's notifications (personal + role-based)
     */
    public function scopeForUser($query, $user)
    {
        if (!$user) {
            return $query->whereRaw('1 = 0'); // Return empty
        }

        $role = optional($user->roles)->pluck('name')->first();
        
        return $query->where(function ($q) use ($user, $role) {
            // Personal notifications
            $q->where('user_id', $user->id);
            
            // Role-based notifications (only if no specific user_id)
            if ($role) {
                $q->orWhere(function($q2) use ($role) {
                    $q2->where('role', $role)
                       ->whereNull('user_id');
                });
            }
        });
    }
}