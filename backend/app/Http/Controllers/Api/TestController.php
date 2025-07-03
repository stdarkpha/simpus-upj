<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Events\NotificationCreated;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TestController extends Controller
{
    public function testPusher(Request $request)
    {
        $user_id = $request->user()->id;

        Log::info('🧪 Testing Pusher notification for user: ' . $user_id);

        // Create a test notification using valid enum values
        $notification = Notification::create([
            'user_id' => $user_id,
            'type' => 'reminder', // Valid: lending, returning, reminder
            'title' => 'Test Notification - ' . now()->format('H:i:s'),
            'desc' => 'This is a test notification to verify Pusher WebSocket is working correctly',
            'variant' => 'success' // Valid: success, warning, error
        ]);

        Log::info('📝 Notification created: ' . $notification->id);

        // Test direct Pusher broadcast without event
        try {
            $pusher = new \Pusher\Pusher(
                config('broadcasting.connections.pusher.key'),
                config('broadcasting.connections.pusher.secret'),
                config('broadcasting.connections.pusher.app_id'),
                config('broadcasting.connections.pusher.options')
            );

            $channel = 'notifications.user.' . $user_id;
            $event = 'notification.created';
            $data = [
                'id' => $notification->id,
                'type' => $notification->type,
                'title' => $notification->title,
                'desc' => $notification->desc,
                'timestamp' => $notification->timestamp,
                'variant' => $notification->variant,
                'is_read' => $notification->is_read,
                'created_at' => $notification->created_at,
                'user_id' => $notification->user_id,
            ];

            Log::info('📡 Direct Pusher broadcast attempt:', [
                'channel' => $channel,
                'event' => $event,
                'data' => $data
            ]);

            $result = $pusher->trigger($channel, $event, $data);
            Log::info('✅ Direct Pusher result:', ['result' => $result]);
        } catch (\Exception $e) {
            Log::error('❌ Direct Pusher failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Pusher test failed: ' . $e->getMessage(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }

        // Also try the event broadcast
        try {
            broadcast(new NotificationCreated($notification));
            Log::info('📡 Event broadcast successful for user: ' . $user_id);
        } catch (\Exception $e) {
            Log::error('❌ Event broadcast failed: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Test notification sent successfully',
            'notification' => $notification,
            'channel' => 'notifications.user.' . $user_id,
            'debug' => [
                'queue_connection' => config('queue.default'),
                'broadcast_driver' => config('broadcasting.default'),
                'pusher_config' => [
                    'key' => config('broadcasting.connections.pusher.key'),
                    'cluster' => config('broadcasting.connections.pusher.options.cluster'),
                    'app_id' => config('broadcasting.connections.pusher.app_id'),
                    'secret_set' => !empty(config('broadcasting.connections.pusher.secret')),
                ]
            ]
        ]);
    }

    public function testLogBroadcast(Request $request)
    {
        $user_id = $request->user()->id;

        Log::info('🧪 Testing log-based broadcasting for user: ' . $user_id);

        // Temporarily change broadcast driver to log
        config(['broadcasting.default' => 'log']);

        // Create a test notification
        $notification = Notification::create([
            'user_id' => $user_id,
            'type' => 'reminder',
            'title' => 'Log Test Notification - ' . now()->format('H:i:s'),
            'desc' => 'This is a test notification using log driver',
            'variant' => 'success'
        ]);

        Log::info('📝 Log test notification created: ' . $notification->id);

        try {
            // Broadcast the notification using log driver
            broadcast(new NotificationCreated($notification));
            Log::info('📡 Log broadcast completed for user: ' . $user_id);

            return response()->json([
                'success' => true,
                'message' => 'Log broadcast test completed successfully',
                'notification' => $notification,
                'note' => 'Check Laravel logs for broadcast output'
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Log broadcast failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Log broadcast test failed: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function testSSE(Request $request)
    {
        $user_id = $request->user()->id;

        Log::info('🧪 Testing SSE notification for user: ' . $user_id);

        // Create a test notification using valid enum values
        $notification = Notification::create([
            'user_id' => $user_id,
            'type' => 'reminder',
            'title' => 'SSE Test Notification - ' . now()->format('H:i:s'),
            'desc' => 'This is a test notification for Server-Sent Events',
            'variant' => 'success'
        ]);

        Log::info('📝 SSE test notification created: ' . $notification->id);

        return response()->json([
            'success' => true,
            'message' => 'SSE test notification created successfully',
            'notification' => $notification,
            'note' => 'Check your SSE connection for real-time updates'
        ]);
    }
}
