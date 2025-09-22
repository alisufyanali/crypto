<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;


class UserController extends Controller
{
  
    public function index()
    {
        return Inertia::render('Users/Index');
    }

    public function getData()
    {
        $users = User::latest();

        return DataTables::of($users)
            ->addColumn('status', function($user) {
                return $user->status ? 'Active' : 'Inactive';
            })
            ->make(true);
    }

    public function show(User $user)
    {
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

    // Optional: Status toggle
    public function toggleStatus(User $user)
    {
        $user->status = !$user->status;
        $user->save();

        return response()->json(['success' => true, 'status' => $user->status]);
    }

}
