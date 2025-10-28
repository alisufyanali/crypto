<?php

use App\Models\Notification;

if (!function_exists('createNotification')) {
    /**
     * Create a notification
     * 
     * @param string|null $role Target role (e.g., 'Admin', 'PM', 'User')
     * @param string $message Notification message
     * @param int|null $userId Specific user ID (optional)
     * @param string $type Notification type
     * @param string|null $title Notification title
     */
    function createNotification(
        ?string $role, 
        string $message, 
        ?int $userId = null, 
        string $type = 'general',
        ?string $title = null
    ) {
        return Notification::create([
            'role' => $role,
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'is_read' => false,
        ]);
    }
}