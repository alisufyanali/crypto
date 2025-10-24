<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/live-notifications', function (Request $request) {
    $user = $request->user();
    return response()->json([
        'notifications' => $user->notifications()->latest()->take(10)->get(),
        'unread_count' => $user->unreadNotifications()->count(),
    ]);
});
// Route::middleware('auth:sanctum')->get('/live-notifications', function (Request $request) {
//     $user = $request->user();
//     return response()->json([
//         'notifications' => $user->notifications()->latest()->take(10)->get(),
//         'unread_count' => $user->unreadNotifications()->count(),
//     ]);
// }); 