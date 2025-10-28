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

    public function scopeForUser($query, $user)
    {
        $role = $user->roles->pluck('name')->first();
        
        return $query->where(function ($q) use ($user, $role) {
            $q->where('user_id', $user->id)
              ->orWhere('role', $role);
        });
    }
}