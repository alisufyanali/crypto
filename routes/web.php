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
Route::middleware('auth')->group(function () {
    Route::get('/kyc/upload', [KycController::class, 'showUploadForm'])->name('kyc.upload');
    Route::post('/kyc/upload', [KycController::class, 'store'])->name('kyc.store');
});

// ✅ USER-SPECIFIC ROUTES (with KYC middleware)
Route::middleware(['auth', 'kyc'])->group(function () {
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

    // Order Management
    Route::resource('orders', OrderController::class);


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
