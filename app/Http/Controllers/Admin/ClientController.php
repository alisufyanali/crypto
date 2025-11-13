<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;
use Hash;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        // URL se kyc_status parameter pass karein frontend ko
        return Inertia::render('Clients/Index', [
            'kyc_status' => $request->get('kyc_status', '')
        ]);
    }

    public function getData(Request $request)
    {
        // Start with base query
        $query = User::where('role', 'client');

        // KYC status filter apply karein
        if ($request->has('kyc_status') && $request->kyc_status !== '') {
            $query->where('kyc_status', $request->kyc_status);
        }

        // Search functionality
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('kyc_status', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->input('per_page', 10);
        $clients = $query->paginate($perPage);

        return response()->json([
            'data' => $clients->items(),
            'current_page' => $clients->currentPage(),
            'last_page' => $clients->lastPage(),
            'per_page' => $clients->perPage(),
            'total' => $clients->total(),
            'from' => $clients->firstItem(),
            'to' => $clients->lastItem(),
        ]);
    }

    // ... rest of your methods remain the same
    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);

        User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'client',
            'kyc_status' => 'pending',
        ]);

        return redirect()->route('clients.index')->with('success', 'Client created successfully.');
    }

    public function edit(User $client)
    {
        if ($client->role !== 'client') {
            abort(404);
        }

        return Inertia::render('Clients/Edit', [
            'client' => $client,
        ]);
    }

    public function update(Request $request, User $client)
    {
        if ($client->role !== 'client') {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $client->id,
            'password' => 'nullable|min:6|confirmed',
        ]);

        $client->name = $validated['name'];
        $client->email = $validated['email'];

        if (!empty($validated['password'])) {
            $client->password = bcrypt($validated['password']);
        }

        $client->save();

        return redirect()->route('clients.index')->with('success', 'Client updated successfully.');
    }

    public function show(User $client)
    {
        $client->load('kycDocuments');

        return Inertia::render('Clients/Show', [
            'client' => $client,
        ]);
    }

    public function destroy(User $client)
    {
        $client->delete();

        return redirect()->route('clients.index')->with('success', 'Client deleted successfully.');
    }

    public function toggleStatus(User $client)
    {
        $client->is_active = !$client->is_active;
        $client->save();

        return back()->with('success', 'User status updated successfully.');
    }

    public function updateKycStatus(Request $request, User $client)
    {
        $request->validate([
            'kyc_status' => 'required|in:pending,approved,rejected',
        ]);

        $client->kyc_status = $request->kyc_status;
        $client->save();

        createNotification(
            'client',
            "KYC status has been updated to {$request->kyc_status}.",
            $client->id,
            'kyc',
            'Client KYC Updated'
        );

        return back()->with('success', 'KYC status updated successfully.');
    }
}