<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller; // ✅ Ensure this line is present
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');
    }

    /**
     * 🔹 Show all notifications (user + role based)
     */
    public function index()
    {
        $user = Auth::user();
        $role = $user->roles->pluck('name')->first();

        $notifications = Notification::orderBy('created_at', 'desc')
            ->get(['id', 'message', 'is_read', 'created_at']);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * 🔹 Mark notification as read
     */
    public function markAsRead($id)
    {
        $notification = $this->findNotification($id);
        $notification->update(['is_read' => true]);

        return back()->with('success', 'Notification marked as read.');
    }

    /**
     * 🔹 Toggle read/unread (optional)
     */
    public function toggleRead($id)
    {
        $notification = $this->findNotification($id);
        $notification->update(['is_read' => !$notification->is_read]);

        return back()->with('success', 'Notification status updated.');
    }

    /**
     * 🔹 Delete notification
     */
    public function destroy($id)
    {
        $notification = $this->findNotification($id);
        $notification->delete();

        return back()->with('success', 'Notification deleted successfully.');
    }

    /**
     * 🔹 Unread count for live badge
     */
    public function unreadCount()
    {
        $user = Auth::user();
        $role = $user->roles->pluck('name')->first();

        $count = Notification::where(function ($q) use ($user, $role) {
            $q->where('user_id', $user->id)
                ->orWhere(function ($q2) use ($role) {
                    $q2->whereNotNull('role')->where('role', $role);
                });
        })
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * 🔹 Helper for authorization
     */
    protected function findNotification($id)
    {
        $user = Auth::user();
        $role = $user->roles->pluck('name')->first();

        $notification = Notification::findOrFail($id);

        if ($notification->user_id && $notification->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        if ($notification->role && $notification->role !== $role) {
            abort(403, 'Unauthorized');
        }

        return $notification;
    }
}
