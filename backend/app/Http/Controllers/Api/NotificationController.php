<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Pusher\Pusher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{

    /**
     * Get notifications for the authenticated user
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();

            $notifications = Notification::where('user_id', $user->id)
                ->orderBy('timestamp', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $notifications,
                'message' => 'Notifications retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve notifications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        try {
            $user = $request->user();

            $notification = Notification::where('user_id', $user->id)
                ->where('id', $id)
                ->first();

            if (!$notification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Notification not found'
                ], 404);
            }

            $notification->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark notification as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark all notifications as read for the authenticated user
     */
    public function markAllAsRead(Request $request)
    {
        try {
            $user = $request->user();

            Notification::where('user_id', $user->id)
                ->where('is_read', false)
                ->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'All notifications marked as read'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark all notifications as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get unread notification count for the authenticated user
     */
    public function getUnreadCount(Request $request)
    {
        try {
            $user = $request->user();

            $unreadCount = Notification::where('user_id', $user->id)
                ->where('is_read', false)
                ->count();

            return response()->json([
                'success' => true,
                'data' => ['unread_count' => $unreadCount],
                'message' => 'Unread count retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get unread count',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new notification and send via Pusher
     */
    public function create(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'type' => 'required|in:info,success,warning,error',
                'title' => 'required|string|max:255',
                'message' => 'required|string',
                'data' => 'nullable|array'
            ]);

            // Create notification in database
            $notification = Notification::create([
                'user_id' => $request->user_id,
                'type' => $request->type,
                'title' => $request->title,
                'message' => $request->message,
                'data' => $request->data,
                'timestamp' => now(),
                'is_read' => false
            ]);

            Log::info('Notification created in database', ['notification_id' => $notification->id]);

            // Send notification via Pusher
            $pusherData = [
                'id' => $notification->id,
                'type' => $notification->type,
                'title' => $notification->title,
                'message' => $notification->message,
                'data' => $notification->data,
                'timestamp' => $notification->timestamp->toISOString(),
                'is_read' => false
            ];

            $pusherSent = false;
            try {
                $pusher = new Pusher(
                    env('PUSHER_APP_KEY'),
                    env('PUSHER_APP_SECRET'),
                    env('PUSHER_APP_ID'),
                    [
                        'cluster' => env('PUSHER_APP_CLUSTER'),
                        'useTLS' => true,
                    ]
                );
                
                $channel = "user.{$request->user_id}";
                $event = 'notification.created';
                
                $result = $pusher->trigger($channel, $event, $pusherData);
                $pusherSent = true;
                
                Log::info('Pusher notification sent successfully', [
                    'user_id' => $request->user_id,
                    'notification_id' => $notification->id,
                    'channel' => $channel,
                    'result' => $result
                ]);
            } catch (\Exception $pusherError) {
                Log::error('Failed to send Pusher notification', [
                    'user_id' => $request->user_id,
                    'notification_id' => $notification->id,
                    'error' => $pusherError->getMessage()
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $notification,
                'pusher_sent' => $pusherSent,
                'message' => 'Notification created and sent successfully'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create notification', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
