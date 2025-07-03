<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationStreamController extends Controller
{
    public function stream(Request $request)
    {
        $user_id = $request->user()->id;

        // Set headers for SSE
        $headers = [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no', // Disable nginx buffering
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Credentials' => 'true',
        ];

        // Get last notification ID from query parameter
        $lastId = $request->query('last_id', 0);

        // Get new notifications since last ID
        $notifications = Notification::where('user_id', $user_id)
            ->where('id', '>', $lastId)
            ->orderBy('id', 'desc')
            ->limit(10) // Limit to prevent too much data
            ->get();

        $output = '';

        foreach ($notifications as $notification) {
            $data = json_encode([
                'id' => $notification->id,
                'type' => $notification->type,
                'title' => $notification->title,
                'desc' => $notification->desc,
                'variant' => $notification->variant,
                'is_read' => $notification->is_read,
                'created_at' => $notification->created_at->toISOString(),
                'user_id' => $notification->user_id,
            ]);

            $output .= "data: " . $data . "\n\n";
        }

        // If no new notifications, send a heartbeat
        if (empty($output)) {
            $output = "data: " . json_encode([
                'type' => 'heartbeat',
                'timestamp' => now()->toISOString(),
                'user_id' => $user_id
            ]) . "\n\n";
        }

        return response($output, 200, $headers);
    }
}
