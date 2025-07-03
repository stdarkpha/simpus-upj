<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Services\PusherService;
use Illuminate\Foundation\Application;

// Bootstrap Laravel app
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing PusherService...\n";

try {
    $service = new PusherService();
    echo "PusherService created successfully\n";

    $result = $service->testConnection();
    echo "Test connection result:\n";
    print_r($result);

    // Test sending notification to user ID 1 (if exists)
    $testData = [
        'id' => 999,
        'type' => 'info',
        'title' => 'Test Notification',
        'message' => 'This is a test notification from script',
        'data' => ['test' => true],
        'timestamp' => date('c'),
        'is_read' => false
    ];

    echo "\nTesting notification send to user 1:\n";
    $sendResult = $service->sendNotification(1, $testData);
    echo "Send result: " . ($sendResult ? 'SUCCESS' : 'FAILED') . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
