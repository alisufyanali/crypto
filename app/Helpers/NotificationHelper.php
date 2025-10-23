<?php

use App\Models\Notification;

/**
 * @param string|null $role     Target role (e.g. 'Admin','PM','User') OR null for user-specific
 * @param string $message
 * @param int|null $userId      Specific user id (optional)
 * @param string $type
 */
if (! function_exists('createNotification')) {
    function createNotification(?string $role, string $message, ?int $userId = null, string $type = 'general') {
        return Notification::create([
            'role' => $role,
            'user_id' => $userId,
            'type' => $type,
            'message' => $message,
            'is_read'   => false,
        ]);
    }
}
