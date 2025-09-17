<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
     public function index()
    {
        $stock = Stock::latest()->get();
        return Inertia::render('Stocks/Index', [
            'stock' => $stock
        ]);
    }
}
