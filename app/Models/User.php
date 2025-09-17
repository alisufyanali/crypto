<?php
// app/Models/User.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'phone', 'address', 
        'national_id', 'kyc_status', 'is_active'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function portfolio()
    {
        return $this->hasMany(Portfolio::class);
    }

    public function accountBalance()
    {
        return $this->hasOne(AccountBalance::class);
    }

    public function kycDocuments()
    {
        return $this->hasMany(KycDocument::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // Scopes
    public function scopeClients($query)
    {
        return $query->where('role', 'client');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Helper methods
    public function isClient()
    {
        return $this->role === 'client';
    }

    public function isBroker()
    {
        return $this->role === 'broker';
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function hasApprovedKyc()
    {
        return $this->kyc_status === 'approved';
    }
}