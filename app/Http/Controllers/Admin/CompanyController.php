<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Stock;
use App\Models\StockPrice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;

class CompanyController extends Controller
{

    public function index(Request $request)
    {
        return Inertia::render('Companies/Index', [
            'userRole' => $request->user()->role,
        ]);
    }

    
    public function show(Company $company)
    {
        $company->load('currentStock');
        
        // Get price history for the last 30 days
        $priceHistory = StockPrice::where('company_id', $company->id)
            ->orderBy('price_date', 'desc')
            ->take(30)
            ->get()
            ->reverse()
            ->values();
            
        return Inertia::render('Companies/Show', [
            'company' => $company,
            'priceHistory' => $priceHistory,
        ]);
    }

//     public function show(Company $company)
// {
//     // relations bhi laa lo (agar chahiye ho jaise stocks waghera)
//     $company->load('stocks', 'stockPrices');

//     return inertia('companies/show', [
//         'company' => $company
//     ]);
// }

    
    public function create()
    {
        return Inertia::render('Companies/Create');
    }
    
    public function store(Request $request)
    {
        
        $request->validate([
            'name' => 'required|string|max:255',
            'symbol' => 'required|string|max:10|unique:companies',
            'description' => 'nullable|string',
            'sector' => 'nullable|string|max:255',
            'market_cap' => 'nullable|numeric|min:0',
            'shares_outstanding' => 'nullable|integer|min:0',
            'current_price' => 'required|numeric|min:0.01',
            'logo' => 'nullable|image|max:2048',
        ]);
        
        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('company-logos', 'public');
        }
        
        $company = Company::create([
            'name' => $request->name,
            'symbol' => strtoupper($request->symbol),
            'description' => $request->description,
            'sector' => $request->sector,
            'market_cap' => $request->market_cap,
            'shares_outstanding' => $request->shares_outstanding,
            'logo_path' => $logoPath,
        ]);
        
        // Create initial stock record
        Stock::create([
            'company_id' => $company->id,
            'current_price' => $request->current_price,
            'previous_close' => $request->current_price,
            'day_high' => $request->current_price,
            'day_low' => $request->current_price,
        ]);
        
        // Create initial price history
        StockPrice::create([
            'company_id' => $company->id,
            'price' => $request->current_price,
            'price_date' => today(),
        ]);
        
        return redirect()->route('companies.index')
            ->with('success', 'Company created successfully.');
    }
    
    public function edit(Company $company)
    {
        
        $company->load('currentStock');
        
        return Inertia::render('Companies/Edit', [
            'company' => $company,
        ]);
    }
    
    public function update(Request $request, Company $company)
    {
        
        $request->validate([
            'name' => 'required|string|max:255',
            'symbol' => 'required|string|max:10|unique:companies,symbol,' . $company->id,
            'description' => 'nullable|string',
            'sector' => 'nullable|string|max:255',
            'market_cap' => 'nullable|numeric|min:0',
            'shares_outstanding' => 'nullable|integer|min:0',
            'logo' => 'nullable|image|max:2048',
        ]);
        
        $updateData = [
            'name' => $request->name,
            'symbol' => strtoupper($request->symbol),
            'description' => $request->description,
            'sector' => $request->sector,
            'market_cap' => $request->market_cap,
            'shares_outstanding' => $request->shares_outstanding,
        ];
        
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($company->logo_path) {
                Storage::disk('public')->delete($company->logo_path);
            }
            $updateData['logo_path'] = $request->file('logo')->store('company-logos', 'public');
        }
        
        $company->update($updateData);
        
        return redirect()->route('companies.index')
            ->with('success', 'Company updated successfully.');
    }
    
    public function updatePrice(Request $request, Company $company)
    {
        $request->validate([
            'price' => 'required|numeric|min:0.01',
            'volume' => 'nullable|integer|min:0',
        ]);
        
        $currentStock = $company->currentStock;
        $newPrice = $request->price;
        $previousClose = $currentStock?->current_price ?? $newPrice;
        
        $changeAmount = $newPrice - $previousClose;
        $changePercentage = $previousClose > 0 ? ($changeAmount / $previousClose) * 100 : 0;
        
        // Update current stock record
        if ($currentStock) {
            $currentStock->update([
                'previous_close' => $currentStock->current_price,
                'current_price' => $newPrice,
                'day_high' => max($currentStock->day_high, $newPrice),
                'day_low' => min($currentStock->day_low, $newPrice),
                'volume' => ($currentStock->volume ?? 0) + ($request->volume ?? 0),
                'change_amount' => $changeAmount,
                'change_percentage' => $changePercentage,
                'last_updated' => now(),
            ]);
        } else {
            Stock::create([
                'company_id' => $company->id,
                'current_price' => $newPrice,
                'previous_close' => $newPrice,
                'day_high' => $newPrice,
                'day_low' => $newPrice,
                'volume' => $request->volume ?? 0,
                'change_amount' => 0,
                'change_percentage' => 0,
            ]);
        }
        
        // Add to price history
        StockPrice::updateOrCreate(
            ['company_id' => $company->id, 'price_date' => today()],
            ['price' => $newPrice, 'volume' => $request->volume ?? 0]
        );
        
        // Update all portfolios with this company
        $company->portfolios->each(function ($portfolio) {
            $portfolio->updateCurrentValue();
            $portfolio->user->accountBalance?->updateFromPortfolio();
        });
        
        return back()->with('success', 'Stock price updated successfully.');
    }

    
    public function destroy(Company $company)
    {
        $company->stocks()->delete();
        $company->stockPrices()->delete();
        $company->delete();

        return redirect()->route('companies.index')
            ->with('success', 'Company and related records deleted successfully.');
    }

    public function getData()
    {
        $companies = Company::latest();

        return DataTables::of($companies)
            ->make(true);
    }



}
