<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Lending;
use App\Models\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Pusher\Pusher;
use Exception;

class UpdateOverdueLendings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lending:update-overdue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update lending status to overdue for books that have passed their return date';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting overdue lending update process...');

        try {
            // Get all lending records where:
            // 1. return_date is past today
            // 2. status is 'claim' (currently borrowed)
            $today = now()->startOfDay();

            $overdueLendings = Lending::with(['user'])
                ->where('return_date', '<', $today)
                ->where('status', 'claim')
                ->get();

            if ($overdueLendings->isEmpty()) {
                $this->info('No overdue lendings found.');
                Log::info('Cron job: No overdue lendings found during scheduled check');
                return 0;
            }

            $this->info('Found ' . $overdueLendings->count() . ' overdue lending(s). Processing...');

            $updatedCount = 0;
            $notifications = [];

            DB::beginTransaction();

            foreach ($overdueLendings as $lending) {
                // Update status to overdue
                $lending->status = 'overdue';
                $lending->save();
                $updatedCount++;

                // Create notification for overdue lending
                $daysOverdue = now()->diffInDays($lending->return_date);

                $notification = Notification::create([
                    'user_id' => $lending->user_id,
                    'type' => 'warning',
                    'title' => 'Peminjaman Terlambat',
                    'message' => "Peminjaman buku Anda telah terlambat {$daysOverdue} hari. Segera kembalikan ke perpustakaan.",
                    'data' => [
                        'lending_id' => $lending->id,
                        'transaction_id' => $lending->transaction_id,
                        'return_date' => $lending->return_date->format('Y-m-d'),
                        'days_overdue' => $daysOverdue,
                        'action' => 'overdue'
                    ],
                    'timestamp' => now(),
                    'is_read' => false
                ]);

                $notifications[] = $notification;

                $this->info("- Updated lending ID {$lending->id} (Transaction: {$lending->transaction_id}) - {$daysOverdue} days overdue");

                Log::info('Cron job: Lending marked as overdue', [
                    'lending_id' => $lending->id,
                    'user_id' => $lending->user_id,
                    'transaction_id' => $lending->transaction_id,
                    'return_date' => $lending->return_date->format('Y-m-d'),
                    'days_overdue' => $daysOverdue
                ]);
            }

            DB::commit();

            // Send real-time notifications via Pusher
            $this->info('Sending notifications...');

            foreach ($notifications as $notification) {
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

                    $channel = "user.{$notification->user_id}";
                    $event = 'notification.created';

                    $result = $pusher->trigger($channel, $event, $pusherData);

                    Log::info('Cron job: Pusher overdue notification sent successfully', [
                        'user_id' => $notification->user_id,
                        'notification_id' => $notification->id,
                        'channel' => $channel
                    ]);
                } catch (\Exception $e) {
                    Log::error('Cron job: Failed to send Pusher overdue notification', [
                        'user_id' => $notification->user_id,
                        'notification_id' => $notification->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            $this->info("Successfully updated {$updatedCount} lending(s) to overdue status.");
            $this->info("Sent " . count($notifications) . " notification(s).");

            Log::info('Cron job: Overdue lendings update completed successfully', [
                'updated_count' => $updatedCount,
                'notifications_sent' => count($notifications)
            ]);

            return 0;
        } catch (Exception $e) {
            DB::rollBack();

            $this->error('Error occurred while updating overdue lendings: ' . $e->getMessage());

            Log::error('Cron job: Error in overdue lendings update', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return 1;
        }
    }
}
