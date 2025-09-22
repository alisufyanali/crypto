<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;


class StockController extends Controller
{
     public function index()
    {
        $stock = Stock::latest()->get();
        return Inertia::render('Stocks/Index', [
            'stock' => $stock
        ]);
    }

    public function create()
    {
        $companies = Company::select('id', 'name')->get();
        return Inertia::render('Stocks/Create', [
            'companies' => $companies,
        ]);
    }


     public function store(Request $request)
    {
        // ✅ Validation rules
        $validated = $request->validate([
            'company_id'        => 'required|exists:companies,id',
            'current_price'     => 'required|numeric|min:0',
            'previous_close'    => 'nullable|numeric|min:0',
            'day_high'          => 'nullable|numeric|min:0',
            'day_low'           => 'nullable|numeric|min:0',
            'volume'            => 'required|integer|min:0',
            'change_amount'     => 'nullable|numeric',
            'change_percentage' => 'nullable|numeric',
        ]);

        // ✅ Create Stock
        Stock::create($validated);

        // ✅ Redirect with success
        return redirect()
            ->route('stocks.index')
            ->with('success', 'Stock created successfully.');
    }

    public function show($id)
    {
        $stock = Stock::with('company')->findOrFail($id);
        return inertia('Stocks/Show', [
            'stock' => $stock,
        ]);
    }
    
      // 🖊️ Edit Page
    public function edit($id)
    {
        $stock = Stock::with('company')->findOrFail($id);
        $companies = Company::all(['id', 'name']); // dropdown ke liye

        return Inertia::render('Stocks/Edit', [
            'stock' => $stock,
            'companies' => $companies
        ]);
    }

    // 🔄 Update Function
    public function update(Request $request, $id)
    {
        $request->validate([
            'current_price' => 'required|numeric',
            'previous_close' => 'nullable|numeric',
            'day_high' => 'nullable|numeric',
            'day_low' => 'nullable|numeric',
            'volume' => 'nullable|numeric',
            'change_amount' => 'nullable|numeric',
            'change_percentage' => 'nullable|numeric',
            'company_id' => 'required|exists:companies,id',
        ]);

        $stock = Stock::findOrFail($id);
        $stock->update($request->all());

        return redirect()->route('stocks.index')->with('success', 'Stock updated successfully.');
    }

    
    public function destroy(Stock $stock)
    {
        $stock->delete();

        return redirect()->route('stocks.index')
            ->with('success', 'Stock deleted successfully.');
    }


    public function getData()
    {
        $stocks = Stock::with('company')->latest();

        return  DataTables::of($stocks)
            ->addColumn('company_name', function ($row) {
                return $row->company ? $row->company->name : '-';
            })
            ->make(true);
    }




    /**
     * Quick price update for real-time updates
     */
    public function updatePrice(Request $request, Stock $stock)
    {
        $this->authorize('update', $stock);

        $request->validate([
            'price' => 'required|numeric|min:0.01',
            'volume' => 'nullable|integer|min:0',
        ]);

        DB::transaction(function () use ($request, $stock) {
            $oldPrice = $stock->current_price;
            $newPrice = $request->price;
            
            // Calculate change
            $changeAmount = $newPrice - $stock->previous_close;
            $changePercentage = $stock->previous_close > 0 ? ($changeAmount / $stock->previous_close) * 100 : 0;

            // Update current stock
            $stock->update([
                'current_price' => $newPrice,
                'day_high' => max($stock->day_high, $newPrice),
                'day_low' => min($stock->day_low, $newPrice),
                'volume' => $stock->volume + ($request->volume ?? 0),
                'change_amount' => $changeAmount,
                'change_percentage' => $changePercentage,
                'last_updated' => now(),
            ]);

            // Update price history
            StockPrice::updateOrCreate(
                [
                    'company_id' => $stock->company_id,
                    'price_date' => today(),
                ],
                [
                    'price' => $newPrice,
                    'volume' => ($stock->volume ?? 0) + ($request->volume ?? 0),
                ]
            );

            // Update portfolios
            $this->updatePortfoliosForCompany($stock->company_id);

            // Log the activity
            activity()
                ->performedOn($stock)
                ->causedBy(auth()->user())
                ->withProperties([
                    'old_price' => $oldPrice,
                    'new_price' => $newPrice,
                    'volume_added' => $request->volume ?? 0,
                ])
                ->log('Stock price updated (quick update)');
        });

        return response()->json([
            'success' => true,
            'message' => 'Stock price updated successfully',
            'data' => [
                'current_price' => $stock->current_price,
                'change_amount' => $stock->change_amount,
                'change_percentage' => $stock->change_percentage,
                'day_high' => $stock->day_high,
                'day_low' => $stock->day_low,
                'volume' => $stock->volume,
            ]
        ]);
    }

    /**
     * Bulk price update for multiple stocks
     */
    public function bulkUpdate(Request $request)
    {
        $this->authorize('create', Stock::class);

        $request->validate([
            'updates' => 'required|array',
            'updates.*.company_id' => 'required|exists:companies,id',
            'updates.*.price' => 'required|numeric|min:0.01',
            'updates.*.volume' => 'nullable|integer|min:0',
        ]);

        $updatedCount = 0;
        $errors = [];

        DB::transaction(function () use ($request, &$updatedCount, &$errors) {
            foreach ($request->updates as $index => $update) {
                try {
                    $stock = Stock::where('company_id', $update['company_id'])
                        ->latest('created_at')
                        ->first();

                    if (!$stock) {
                        // Create new stock entry if none exists
                        $stock = Stock::create([
                            'company_id' => $update['company_id'],
                            'current_price' => $update['price'],
                            'previous_close' => $update['price'],
                            'day_high' => $update['price'],
                            'day_low' => $update['price'],
                            'volume' => $update['volume'] ?? 0,
                            'change_amount' => 0,
                            'change_percentage' => 0,
                            'last_updated' => now(),
                        ]);
                    } else {
                        // Update existing stock
                        $changeAmount = $update['price'] - $stock->previous_close;
                        $changePercentage = $stock->previous_close > 0 ? ($changeAmount / $stock->previous_close) * 100 : 0;

                        $stock->update([
                            'current_price' => $update['price'],
                            'day_high' => max($stock->day_high, $update['price']),
                            'day_low' => min($stock->day_low, $update['price']),
                            'volume' => ($stock->volume ?? 0) + ($update['volume'] ?? 0),
                            'change_amount' => $changeAmount,
                            'change_percentage' => $changePercentage,
                            'last_updated' => now(),
                        ]);
                    }

                    // Update price history
                    StockPrice::updateOrCreate(
                        [
                            'company_id' => $update['company_id'],
                            'price_date' => today(),
                        ],
                        [
                            'price' => $update['price'],
                            'volume' => $update['volume'] ?? 0,
                        ]
                    );

                    // Update portfolios
                    $this->updatePortfoliosForCompany($update['company_id']);
                    
                    $updatedCount++;
                    
                } catch (\Exception $e) {
                    $errors[] = "Row {$index}: " . $e->getMessage();
                }
            }
        });

        if (count($errors) > 0) {
            return back()->withErrors([
                'bulk_update' => 'Some updates failed: ' . implode(', ', $errors)
            ])->with('warning', "{$updatedCount} stocks updated successfully, but some failed.");
        }

        return redirect()->route('stocks.index')
            ->with('success', "{$updatedCount} stocks updated successfully.");
    }



}
