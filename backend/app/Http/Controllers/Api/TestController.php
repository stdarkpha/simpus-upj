<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Pusher\Pusher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TestController extends Controller
{
    /**
     * Test Pusher connection and send a test notification
     */
    public function testPusher(Request $request)
    {
        try {
            $user_id = $request->user()->id;

            Log::info('🧪 Testing Pusher notification for user: ' . $user_id);

            // Create a test notification
            $notification = Notification::create([
                'user_id' => $user_id,
                'type' => 'info',
                'title' => 'Test Notification - ' . now()->format('H:i:s'),
                'message' => 'This is a test notification to verify Pusher WebSocket is working correctly',
                'data' => [
                    'test' => true,
                    'timestamp' => now()->toISOString()
                ],
                'timestamp' => now(),
                'is_read' => false
            ]);

            Log::info('📝 Test notification created: ' . $notification->id);

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
                
                $channel = "user.{$user_id}";
                $event = 'notification.created';
                
                $result = $pusher->trigger($channel, $event, $pusherData);
                
                Log::info('Test Pusher notification sent successfully', [
                    'user_id' => $user_id,
                    'notification_id' => $notification->id,
                    'channel' => $channel,
                    'result' => $result
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Test notification sent successfully',
                    'data' => [
                        'notification' => $notification,
                        'pusher_result' => $result,
                        'channel' => $channel
                    ]
                ]);
            } catch (\Exception $pusherError) {
                Log::error('Failed to send test Pusher notification', [
                    'user_id' => $user_id,
                    'notification_id' => $notification->id,
                    'error' => $pusherError->getMessage()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Pusher failed, but notification was created',
                    'data' => [
                        'notification' => $notification,
                        'pusher_error' => $pusherError->getMessage()
                    ]
                ]);
            }

        } catch (\Exception $e) {
            Log::error('🚨 Test Pusher failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Test failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test Pusher connection only
     */
    public function testConnection(Request $request)
    {
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
            
            $testData = [
                'message' => 'Connection test',
                'timestamp' => now()->toISOString()
            ];

            $result = $pusher->trigger('test-channel', 'test-event', $testData);

            return response()->json([
                'success' => true,
                'message' => 'Pusher connection successful',
                'data' => $result
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Connection test failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
