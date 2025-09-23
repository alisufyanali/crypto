<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;

class ClientController extends Controller
{
    public function index()
    {
        return Inertia::render('Clients/Index');
    }

    public function getData()
    {
        $clients = User::where('role', 'client')->latest();

        return DataTables::of($clients)
            ->addColumn('is_active', function($client) {
                return $client->is_active ? 'Active' : 'Inactive';
            })
            ->make(true);
    }

    // Show create form
    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    // Store new client
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
            'role'     => 'client', // fix role
        ]);

        return redirect()->route('clients.index')->with('success', 'Client created successfully.');
    }


     public function edit(User $client)
    {
        // sirf role client ka allow karo
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
        $client->load('kycDocuments'); // eager load documents

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
        // Toggle the 'is_active' status
        $client->is_active = !$client->is_active;
        $client->save();

        // Return a proper Inertia response
        return back()->with('success', 'User status updated successfully.')->with([
            'client' => $client // Pass updated client data back to the page
        ]);
    }

    public function updateKycStatus(Request $request, User $client)
    {
        $request->validate([
            'kyc_status' => 'required|in:pending,approved,rejected',
        ]);

        $client->kyc_status = $request->kyc_status;
        $client->save();

        return back()->with('success', 'KYC status updated successfully.');
    }


}
