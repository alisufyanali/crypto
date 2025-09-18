<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DashboardController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class , 'index'])->name('dashboard');
        
    Route::resource('Orders', OrderController::class);
    Route::resource('stocks', StockController::class);
    Route::resource('company', CompanyController::class);
    
});


Route::resource('blogs', BlogController::class) ;




require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
