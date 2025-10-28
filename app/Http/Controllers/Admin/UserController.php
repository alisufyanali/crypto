<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;
use Hash;


class UserController extends Controller
{
  
    public function index()
    {
        return Inertia::render('Users/Index');
    }

    public function getData()
    {
        $users = User::where('role', '!=', 'client')->latest() ;

        return DataTables::of($users)
            ->addColumn('status', function($user) {
                return $user->status ? 'Active' : 'Inactive';
            })
            ->make(true);
    }

     // Show create form
    public function create()
    {
        return Inertia::render('Users/Create');
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
            'role'     => 'broker', // fix role
        ]);

        return redirect()->route('users.index')->with('success', 'Users created successfully.');
    }


     public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    { 

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6|confirmed',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }

        $user->save();

        return redirect()->route('users.index')->with('success', 'Users updated successfully.');
    }



    public function show(User $user)
    {
        $user->load('kycDocuments');  
        // Show user details page
        return Inertia::render('Users/Show', [
            'user' => $user
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

      public function toggleStatus(User $user)
    {
        // Toggle the 'is_active' status
        $user->is_active = !$user->is_active;
        $user->save();

        // Return a proper Inertia response
        return back()->with('success', 'User status updated successfully.')->with([
            'user' => $user // Pass updated user data back to the page
        ]);
    }

    public function updateKycStatus(Request $request, $id)
    {
        $request->validate([
            'kyc_status' => 'required|in:pending,approved,rejected',
        ]);

        $user = User::findOrFail($id);
        $user->update(['kyc_status' => $request->kyc_status]);

        return back()->with('success', 'KYC status updated successfully.');
    }

}
