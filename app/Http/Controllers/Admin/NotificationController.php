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
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
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
        try {
            $user = Auth::user();
            $notification = $this->findNotificationForUser($id, $user);
            
            if (!$notification) {
                return response()->json(['error' => 'Notification not found or unauthorized'], 403);
            }
            
            $notification->update(['is_read' => true]);

            return response()->json(['success' => true, 'message' => 'Notification marked as read']);
        } catch (\Exception $e) {
            \Log::error('Mark as read error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Mark all as read
     */
    public function markAllAsRead()
    {
        try {
            $user = Auth::user();
            
            $updated = Notification::forUser($user)
                ->where('is_read', false)
                ->update(['is_read' => true]);

            return response()->json([
                'success' => true, 
                'message' => 'All notifications marked as read',
                'count' => $updated
            ]);
        } catch (\Exception $e) {
            \Log::error('Mark all as read error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete notification
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();
            $notification = $this->findNotificationForUser($id, $user);
            
            if (!$notification) {
                return response()->json(['error' => 'Notification not found or unauthorized'], 403);
            }
            
            $notification->delete();

            return response()->json(['success' => true, 'message' => 'Notification deleted']);
        } catch (\Exception $e) {
            \Log::error('Delete notification error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get unread count only
     */
    public function unreadCount()
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['count' => 0]);
        }
        
        $count = Notification::forUser($user)
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * ✅ Fixed: Find notification for specific user with proper authorization
     */
    protected function findNotificationForUser($id, $user)
    {
        if (!$user) {
            return null;
        }

        $role = optional($user->roles)->pluck('name')->first();

        // Find notification that belongs to this user OR their role
        $notification = Notification::where('id', $id)
            ->where(function ($q) use ($user, $role) {
                // User-specific notification
                $q->where('user_id', $user->id);
                
                // OR role-based notification (if user has that role)
                if ($role) {
                    $q->orWhere(function($q2) use ($role) {
                        $q2->where('role', $role)
                           ->whereNull('user_id');
                    });
                }
            })
            ->first();

        return $notification;
    }
}