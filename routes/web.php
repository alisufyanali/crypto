<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\KycController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClientController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::resource('blogs', BlogController::class);

// ✅ AUTH REQUIRED ROUTES
Route::middleware('auth')->group(function () {
    Route::get('/kyc/upload', [KycController::class, 'showUploadForm'])->name('kyc.upload');
    Route::post('/kyc/upload', [KycController::class, 'store'])->name('kyc.store');
});

// ✅ USER-SPECIFIC ROUTES (with KYC middleware)
Route::middleware(['auth', 'kyc'])
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('user.dashboard');
        Route::get('/orders', [OrderController::class, 'index'])->name('user.orders');
    });
    

Route::middleware(['auth', 'verified', 'role:admin,broker'])->group(function () {
    // Dashboard
    Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('data', [UserController::class, 'getData'])->name('data');
        Route::post('{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('toggleStatus');
        Route::resource('/', UserController::class)->parameters(['' => 'user'])->except(['data']); 
    });

    Route::prefix('clients')->name('clients.')->group(function () {
        Route::get('data', [ClientController::class, 'getData'])->name('data');
        Route::post('{client}/toggle-status', [ClientController::class, 'toggleStatus'])->name('toggleStatus');
        Route::resource('/', ClientController::class)->parameters(['' => 'client'])->except(['data']);
    });

    Route::post('/kyc/{document}/approve', [KycController::class, 'approve'])->name('kyc.approve');
    Route::post('/kyc/{document}/reject', [KycController::class, 'reject'])->name('kyc.reject');
    Route::post('/kyc/{doc}/reset', [KycController::class, 'reset'])->name('kyc.reset');
    Route::post('/clients/{client}/update-kyc', [ClientController::class, 'updateKycStatus'])->name('clients.updateKyc');



    // Order Management
    Route::resource('orders', OrderController::class);
    
    // Stock Management
    Route::resource('stocks', StockController::class);
    Route::get('/stocks-data', [StockController::class, 'getData'])->name('stocks.data');
    
    // Additional stock routes (moved BEFORE resource to avoid conflicts)
    Route::post('/stocks/{stock}/update-price', [StockController::class, 'updatePrice'])
        ->name('stocks.update-price');
    Route::post('/stocks/bulk-update', [StockController::class, 'bulkUpdate'])
        ->name('stocks.bulk-update');
    Route::get('/stocks/export', [StockController::class, 'export'])
        ->name('stocks.export');
    
    // Company Management
    Route::resource('companies', CompanyController::class);
    Route::get('/companies-data', [CompanyController::class, 'getData'])->name('companies.data');
    
    // Market API
    Route::get('/api/market/summary', [StockController::class, 'marketSummary'])
        ->name('market.summary');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
