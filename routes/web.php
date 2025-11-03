<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\OtherController;

use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\StockController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\KycController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\PortfolioController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\AccountBalanceController;

Route::get('/clear-cache', function () {
    try {
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');
        return 'cache cleared successfully';
    } catch (\Exception $e){
        return 'Error Clearing cache: ' . $e->getMessage();
    }
});

// Public Contact Routes
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::get('/about-us', [OtherController::class, 'about'])->name('about');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::resource('blogs', BlogController::class);

// ✅ AUTH REQUIRED ROUTES
// Route::middleware('auth')->group(function () {
//     Route::get('/kyc/upload', [KycController::class, 'showUploadForm'])->name('kyc.upload');
//     Route::post('/kyc/upload', [KycController::class, 'store'])->name('kyc.store');
// });

// ✅ USER-SPECIFIC ROUTES (with KYC middleware)
Route::middleware(['auth', 'kyc'])->group(function () {
      Route::get('/kyc/upload', [KycController::class, 'showUploadForm'])->name('kyc.upload');
    Route::post('/kyc/upload', [KycController::class, 'store'])->name('kyc.store');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('user.dashboard');
});
    

Route::middleware(['auth', 'verified', 'role:admin,broker'])->group(function () {
    // Dashboard
    Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('data', [UserController::class, 'getData'])->name('data');
        Route::post('{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('toggleStatus');
        Route::resource('/', UserController::class)->parameters(['' => 'user'])->except(['data']); 
         Route::post('update-kyc/{id}', [UserController::class, 'updateKycStatus'])->name('updateKyc');
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


        
    Route::get('/admin/contacts', [ContactController::class, 'admin'])->name('admin.contacts');
    Route::patch('/admin/contacts/{contact}/read', [ContactController::class, 'markAsRead'])->name('admin.contacts.read');
    Route::delete('/admin/contacts/{contact}', [ContactController::class, 'destroy'])->name('admin.contacts.destroy');



    // ====== AUDIT MODULES ======
    // Audit Log
    Route::prefix('audit-logs')->name('audit.logs.')->group(function () {
        Route::get('/', [AuditLogController::class, 'index'])->name('index');
        Route::get('/export', [AuditLogController::class, 'export'])->name('export');
        Route::get('/export-full', [AuditLogController::class, 'exportFull'])->name('exportFull');
    });



});


Route::middleware(['auth'])->group(function () {
    // Notification routes
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::get('/live', [NotificationController::class, 'live'])->name('live');
        Route::get('/unread-count', [NotificationController::class, 'unreadCount'])->name('unread-count');
        Route::post('/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('mark-as-read');
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('mark-all-read');
        Route::delete('/{id}', [NotificationController::class, 'destroy'])->name('destroy');
    });



    Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio.index');
    Route::post('/users/{user}/update-balance', [PortfolioController::class, 'updateBalance'])->name('users.update-balance');

    // Orders Routes
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/data', [OrderController::class, 'data'])->name('orders.data'); // 👈 New route
    Route::get('/orders/create', [OrderController::class, 'create'])->name('orders.create');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{order}/approve', [OrderController::class, 'approve'])->name('orders.approve');
    Route::post('/orders/{order}/reject', [OrderController::class, 'reject'])->name('orders.reject');
    Route::post('/orders/{order}/execute', [OrderController::class, 'execute'])->name('orders.execute');
    Route::delete('/orders/{order}', [OrderController::class, 'destroy'])->name('orders.destroy'); // 👈 New route


    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions-data', [TransactionController::class, 'getData'])->name('transactions.data');
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy');

    Route::resource('account-balances', AccountBalanceController::class);
    Route::get('account-balances-data', [AccountBalanceController::class, 'getData'])
        ->name('account-balances.data');

}); 

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
