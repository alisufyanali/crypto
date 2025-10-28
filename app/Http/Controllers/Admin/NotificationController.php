<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Get all notifications for authenticated user
     */
    public function index()
    {
        $user = Auth::user();
        
        $notifications = Notification::forUser($user)
            ->latest()
            ->get(['id', 'title', 'message', 'type', 'is_read', 'created_at']);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * Get live notifications (for polling)
     */
    public function live()
    {
        $user = Auth::user();
        
        $notifications = Notification::forUser($user)
            ->latest()
            ->limit(10)
            ->get(['id', 'title', 'message', 'type', 'is_read', 'created_at']);

        $unreadCount = Notification::forUser($user)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead($id)
    {
        $notification = $this->findNotification($id);
        $notification->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Mark all as read
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        
        Notification::forUser($user)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Delete notification
     */
    public function destroy($id)
    {
        $notification = $this->findNotification($id);
        $notification->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Get unread count only
     */
    public function unreadCount()
    {
        $user = Auth::user();
        
        $count = Notification::forUser($user)
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Find and authorize notification
     */
    protected function findNotification($id)
    {
        $user = Auth::user();
        $role = $user->roles->pluck('name')->first();

        $notification = Notification::findOrFail($id);

        // Check if user has access to this notification
        if ($notification->user_id && $notification->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        if ($notification->role && $notification->role !== $role) {
            abort(403, 'Unauthorized');
        }

        return $notification;
    }
}