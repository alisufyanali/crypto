<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;
use Hash;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'userRole' => auth()->user()->role,
        ]);
    }

    public function getData()
    {
        $users = User::where('role', '!=', 'client')
            ->with('roles')
            ->latest();

        return DataTables::of($users)
            ->addColumn('roles', function($user) {
                return $user->roles->pluck('name')->implode(', ');
            })
            ->addColumn('status', function($user) {
                return $user->status ? 'Active' : 'Inactive';
            })
            ->make(true);
    }

    public function create()
    {
        $roles = Role::where('name', '!=', 'client')->get();

        return Inertia::render('Users/Create', [
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
            'role_id' => 'required|exists:roles,id',
        ]);

        $role = Role::findOrFail($request->role_id);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $role->name, // Set role based on selected role
        ]);

        // Assign role using Spatie
        $user->assignRole($role);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        $roles = Role::where('name', '!=', 'client')->get();
        $userRole = $user->roles->first();

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => $roles,
            'current_role_id' => $userRole ? $userRole->id : null,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6|confirmed',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }

        // Update role if changed
        $newRole = Role::findOrFail($validated['role_id']);
        if ($user->role !== $newRole->name) {
            $user->role = $newRole->name;
            // Sync roles using Spatie
            $user->syncRoles([$newRole->name]);
        }

        $user->save();

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function show(User $user)
    {
        $user->load('kycDocuments', 'roles');
        return Inertia::render('Users/Show', [
            'user' => $user
        ]);
    }

    public function destroy(User $user)
    {
        // Remove roles before deletion
        $user->roles()->detach();
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    public function toggleStatus(User $user)
    {
        $user->is_active = !$user->is_active;
        $user->save();

        return back()->with('success', 'User status updated successfully.');
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