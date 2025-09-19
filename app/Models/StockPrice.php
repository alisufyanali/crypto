<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockPrice extends Model
{
    
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'company_id',
        'price',
        'price_date',
    ];
}
