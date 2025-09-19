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


}
