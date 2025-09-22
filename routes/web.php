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


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
// KYC upload (auth only)
Route::middleware('auth')->group(function () {
    Route::get('/kyc/upload', [KycController::class, 'showUploadForm'])->name('kyc.upload');
    Route::post('/kyc/upload', [KycController::class, 'store'])->name('kyc.store');
});

// All user-specific routes
Route::prefix('user')
    ->middleware(['auth', 'kyc'])
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('user.dashboard');

        // future routes
        Route::get('/orders', [OrderController::class, 'index'])->name('user.orders');
        Route::get('/portfolio', [PortfolioController::class, 'index'])->name('user.portfolio');
    });




 

    // Status toggle

Route::middleware(['auth', 'verified', 'role:admin,broker'])->group(function () {
    
    Route::get('dashboard', [DashboardController::class , 'index'])->name('dashboard');
      Route::get('/', [UserController::class, 'index'])->name('users.index');
    Route::get('/data', [UserController::class, 'getData'])->name('users.data'); // DataTables ajax
    Route::get('/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/', [UserController::class, 'store'])->name('users.store');
    Route::get('/{user}', [UserController::class, 'show'])->name('users.show');
    Route::get('/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggleStatus');
        
    Route::resource('Orders', OrderController::class);
    Route::resource('stocks', StockController::class);
    Route::get('/stocks-data', [StockController::class, 'getData'])->name('stocks.data');
    Route::resource('companies', CompanyController::class);
    Route::get('/companies-data', [CompanyController::class, 'getData']);
    
    // Additional stock routes
    Route::post('stocks/{stock}/update-price', [StockController::class, 'updatePrice'])
        ->name('stocks.update-price');
    Route::post('stocks/bulk-update', [StockController::class, 'bulkUpdate'])
        ->name('stocks.bulk-update');
    Route::get('stocks/export', [StockController::class, 'export'])
        ->name('stocks.export'); 
    Route::get('api/market/summary', [StockController::class, 'marketSummary'])
        ->name('market.summary');
});



Route::resource('blogs', BlogController::class) ;




require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
