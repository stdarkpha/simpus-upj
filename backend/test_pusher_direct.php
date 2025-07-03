<?php

require_once __DIR__ . '/vendor/autoload.php';

use Pusher\Pusher;

echo "Testing direct Pusher integration...\n";

try {
    // Test direct Pusher connection (same as in controllers)
    $pusher = new Pusher(
        '668d263d6e1fb690800d',  // PUSHER_APP_KEY
        'fc2000c3827cac26ca6c',  // PUSHER_APP_SECRET
        '2009080',               // PUSHER_APP_ID
        [
            'cluster' => 'ap1',
            'useTLS' => true,
        ]
    );

    echo "Pusher instance created successfully\n";

    // Test sending a notification
    $testData = [
        'id' => 999,
        'type' => 'info',
        'title' => 'Direct Test Notification',
        'message' => 'This is a test notification using direct Pusher',
        'data' => ['test' => true],
        'timestamp' => date('c'),
        'is_read' => false
    ];

    $channel = "user.1"; // Test channel for user ID 1
    $event = 'notification.created';

    echo "Sending test notification to channel: {$channel}\n";
    $result = $pusher->trigger($channel, $event, $testData);

    echo "✅ SUCCESS! Notification sent successfully\n";
    echo "Result: " . json_encode($result) . "\n";
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
