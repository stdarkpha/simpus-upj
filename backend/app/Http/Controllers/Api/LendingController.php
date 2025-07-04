<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Books;
use App\Models\Lending;
use App\Models\LendingCart;
use App\Models\LendingItem;
use App\Models\Notification;
use Pusher\Pusher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Auth\Access\AuthorizationException;
use App\Helpers\QrCodeHelper;
use Exception;

class LendingController extends Controller
{
    use AuthorizesRequests;
    // add to cart
    public function addToCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => collect($validator->errors()->toArray())
                    ->map(function ($messages) {
                        return $messages[0] ?? '';
                    })
                    ->values()
                    ->all(),
            ], 422);
        }

        $user_id = $request->user()->id;

        // Check if stock book first is available and not already in cart
        $book = Books::find($request->book_id);
        if (!$book || $book->stock < 1) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menambahkan buku ke Tas, buku tidak tersedia atau stok habis.',
            ]);
        }

        $alreadyInCart = LendingCart::where('user_id', $user_id)
            ->where('book_id', $request->book_id)
            ->exists();

        if ($alreadyInCart) {
            return response()->json([
                'success' => false,
                'message' => 'Buku sudah ada di Tas Kamu.',
            ]);
        }

        $cart = LendingCart::create([
            'user_id' => $user_id,
            'book_id' => $request->book_id
        ]);

        return response()->json([
            'success' => true,
            'data' => $cart,
            'message' => 'Buku berhasil ditambahkan ke Tas.',
        ]);
    }

    // view cart
    public function viewCart(Request $request)
    {
        $user_id = $request->user()->id;

        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated.',
            ], 401);
        }

        $cartItems = LendingCart::with('book')
            ->where('user_id', $user_id)
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'success'   => true,
                'data'      => [],
                'message'   => 'Your cart is empty.',
            ]);
        }

        // add image URL to each book in the cart
        $cartItems->transform(function ($cartItem) {
            if ($cartItem->book) {
                $img_url = $cartItem->book->img ? asset('uploads/books/' . $cartItem->book->img) : null;
                $cartItem->book->img = $img_url;
            }
            return $cartItem;
        });

        return response()->json([
            'success'       => true,
            'data'          => $cartItems,
            'message'       => 'Cart items retrieved successfully.',
        ]);
    }

    public function removeFromCart(Request $request, $id)
    {
        $user_id = $request->user()->id;

        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated.',
            ], 401);
        }

        $cartItem = LendingCart::where('user_id', $user_id)
            ->where('id', $id)
            ->first();

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found.',
            ], 404);
        }

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Book removed from cart successfully.',
        ]);
    }

    // clear cart
    public function clearCart(Request $request)
    {
        $user_id = $request->user()->id;

        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated.',
            ], 401);
        }

        LendingCart::where('user_id', $user_id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully.',
        ]);
    }

    // checkout
    public function confirm(Request $request)
    {
        $user_id = $request->user()->id;

        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated.',
            ], 401);
        }

        // validate request lend date
        $validator = Validator::make($request->all(), [
            'days' => 'required|integer|min:1|max:14',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => collect($validator->errors()->toArray())
                    ->map(function ($messages) {
                        return $messages[0] ?? '';
                    })
                    ->values()
                    ->all(),
            ], 422);
        }

        // check if user has items in cart and all items are available
        DB::beginTransaction();
        try {
            $cartItems = LendingCart::where('user_id', $user_id)->get();

            if ($cartItems->isEmpty()) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Your cart is empty.',
                ], 400);
            }

            // Check if all books are still available
            foreach ($cartItems as $item) {
                $book = Books::find($item->book_id);
                if (!$book || $book->stock < 1) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Book '{$item->book->title}' is not available or out of stock.",
                    ], 400);
                }
            }

            // Create a new lending record
            $lending = Lending::create([
                'transaction_id' => uniqid('#'),
                'user_id' => $user_id,
                'lend_date' => now(),
                'return_date' => now()->addDays((int) $request->days),
                'status' => 'pending',
            ]);

            // Create lending items from cart
            foreach ($cartItems as $item) {
                LendingItem::create([
                    'lending_id' => $lending->id,
                    'book_id' => $item->book_id,
                    'amount' => 1, // Assuming each item is lent out one at a time
                ]);

                // Decrease book stock
                $book = Books::find($item->book_id);
                $book->decrement('stock', 1);
            }

            // Clear the cart after successful lending
            LendingCart::where('user_id', $user_id)->delete();
            DB::commit();

            // Create notification for successful lending
            $notification = Notification::create([
                'user_id' => $user_id,
                'type' => 'success',
                'title' => 'Peminjaman Berhasil',
                'message' => 'Peminjaman buku berhasil. Silakan datang ke perpustakaan untuk verifikasi.',
                'data' => [
                    'lending_id' => $lending->id,
                    'lending_date' => $lending->lending_date,
                    'books_count' => count($cartItems)
                ],
                'timestamp' => now(),
                'is_read' => false
            ]);

            Log::info('Lending notification created', ['notification_id' => $notification->id, 'user_id' => $user_id]);

            // Send real-time notification via Pusher
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

                Log::info('Pusher notification sent successfully', [
                    'user_id' => $user_id,
                    'notification_id' => $notification->id,
                    'channel' => $channel,
                    'result' => $result
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to send Pusher notification', [
                    'user_id' => $user_id,
                    'notification_id' => $notification->id,
                    'error' => $e->getMessage()
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $lending,
                'message' => 'Lending confirmed successfully.',
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // view lending history
    public function history(Request $request)
    {
        $user_id = $request->user()->id;
        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated.',
            ], 401);
        }

        $lendings = Lending::with('compact')
            ->where('user_id', $user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        if ($lendings->isEmpty()) {
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'No lending history found.',
            ]);
        }
        return response()->json([
            'success' => true,
            'data' => $lendings,
            'message' => 'Lending history retrieved successfully.',
        ]);
    }

    // generate lending QR code by user request and 

    // get detail lending by id
    public function generateQR($id)
    {
        $lending = Lending::with('user')
            ->where('id', $id)
            ->first();

        if (!$lending) {
            return response()->json([
                'success' => false,
                'message' => 'Lending not found.',
            ], 404);
        }

        $qrdata = json_encode([
            'id_lending' => $lending->id,
            'status' => $lending->status,
            'transaction_id' => $lending->transaction_id,
            'user_details' => [
                'name' => $lending->user->name,
                'email' => $lending->user->email,
                'uid' => $lending->user->uid,
                'role' => $lending->user->role,
            ],
            'lend_date' => $lending->lend_date,
            'return_date' => $lending->return_date,
        ]);

        $lending->qr_code = QrCodeHelper::generateQR($qrdata, $lending->transaction_id);

        return response()->json([
            'success' => true,
            'data' => $lending,
            'message' => 'Lending details retrieved successfully.',
        ]);
    }

    // get lending detail by id
    public function detail($id)
    {
        $lending = Lending::with(['compact', 'user'])
            ->where('id', $id)
            ->first();

        if (!$lending) {
            return response()->json([
                'success' => false,
                'message' => 'Lending not found.',
            ], 404);
        }

        // Add image URL to each book in the lending items > book > img
        $lending->items->transform(function ($item) {
            if ($item->book) {
                $img_url = $item->book->img ? asset('uploads/books/' . $item->book->img) : null;
                $item->book->img = $img_url;
            }
            return $item;
        });

        return response()->json([
            'success' => true,
            'data' => $lending,
            'message' => 'Lending details retrieved successfully.',
        ]);
    }

    // get first lending where status still pending
    public function reminderLending()
    {
        $lending = Lending::with(['items'])
            ->where('status', 'claim')
            ->orderBy('created_at', 'asc')
            ->first();

        if (!$lending) {
            return response()->json([
                'success' => true,
                'message' => 'No pending lending found.',
            ]);
        }

        // Add image URL to each book in the lending items > book > img
        $lending->items->transform(function ($item) {
            if ($item->book) {
                $img_url = $item->book->img ? asset('uploads/books/' . $item->book->img) : null;
                $item->book->img = $img_url;
            }
            return $item;
        });

        return response()->json([
            'success' => true,
            'data' => $lending,
            'message' => 'Pending lending retrieved successfully.',
        ]);
    }


    // change status lending by transaction id
    public function claim($id, Request $request)
    {
        try {
            $this->authorize('admin');

            // Validate the request action approve / reject
            $validator = Validator::make($request->all(), [
                'action' => 'required|in:approve,reject',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => collect($validator->errors()->toArray())
                        ->map(function ($messages) {
                            return $messages[0] ?? '';
                        })
                        ->values()
                        ->all(),
                ], 422);
            }

            $lending = Lending::where('id', $id)->first();

            if (!$lending) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lending not found.',
                ], 404);
            }

            if ($lending->status === 'returned' || $lending->status === 'returned_late') {
                return response()->json([
                    'success' => true,
                    'message' => 'Lending has already been returned.',
                ]);
            }

            if ($request->action === 'reject') {
                $lending->status = 'reject';
                $lending->save();

                // Create notification for rejected lending
                $notification = Notification::create([
                    'user_id' => $lending->user_id,
                    'type' => 'error',
                    'title' => 'Peminjaman Ditolak',
                    'message' => 'Peminjaman buku Anda telah ditolak oleh admin.',
                    'data' => [
                        'lending_id' => $lending->id,
                        'transaction_id' => $lending->transaction_id,
                        'action' => 'rejected'
                    ],
                    'timestamp' => now(),
                    'is_read' => false
                ]);

                Log::info('Lending rejection notification created', ['notification_id' => $notification->id, 'user_id' => $lending->user_id]);

                // Send real-time notification via Pusher
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

                    $channel = "user.{$lending->user_id}";
                    $event = 'notification.created';

                    $result = $pusher->trigger($channel, $event, $pusherData);

                    Log::info('Pusher rejection notification sent successfully', [
                        'user_id' => $lending->user_id,
                        'notification_id' => $notification->id,
                        'channel' => $channel,
                        'result' => $result
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to send Pusher rejection notification', [
                        'user_id' => $lending->user_id,
                        'notification_id' => $notification->id,
                        'error' => $e->getMessage()
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Lending has been rejected.',
                ]);
            }

            $originalStatus = $lending->status;

            switch ($lending->status) {
                case 'pending':
                    $lending->status = 'claim';
                    $message = 'Lending has been approved.';
                    break;
                case 'overdue':
                    $lending->status = 'returned_late';
                    $message = 'Lending has been returned with overdue status.';
                    break;
                default:
                    $lending->status = 'returned';
                    $message = 'Lending has been returned.';
                    break;
            }
            $lending->save();

            // Create notification based on the status change
            $notification = null;
            if ($originalStatus === 'pending' && $lending->status === 'claim') {
                // Approved notification
                $notification = Notification::create([
                    'user_id' => $lending->user_id,
                    'type' => 'success',
                    'title' => 'Peminjaman Disetujui',
                    'message' => 'Peminjaman buku Anda telah disetujui. Silakan ambil buku di perpustakaan.',
                    'data' => [
                        'lending_id' => $lending->id,
                        'transaction_id' => $lending->transaction_id,
                        'action' => 'approved',
                        'status' => 'claim'
                    ],
                    'timestamp' => now(),
                    'is_read' => false
                ]);
            } elseif ($lending->status === 'returned' || $lending->status === 'returned_late') {
                // Return notification
                $notificationType = $lending->status === 'returned_late' ? 'warning' : 'info';
                $notificationTitle = $lending->status === 'returned_late' ? 'Pengembalian Terlambat' : 'Buku Dikembalikan';
                $notificationMessage = $lending->status === 'returned_late'
                    ? 'Buku telah dikembalikan dengan status terlambat.'
                    : 'Buku telah berhasil dikembalikan.';

                $notification = Notification::create([
                    'user_id' => $lending->user_id,
                    'type' => $notificationType,
                    'title' => $notificationTitle,
                    'message' => $notificationMessage,
                    'data' => [
                        'lending_id' => $lending->id,
                        'transaction_id' => $lending->transaction_id,
                        'action' => $lending->status === 'returned_late' ? 'returned_overdue' : 'returned',
                        'status' => $lending->status
                    ],
                    'timestamp' => now(),
                    'is_read' => false
                ]);
            }

            // Send real-time notification via Pusher if notification was created
            if ($notification) {
                Log::info('Lending status change notification created', [
                    'notification_id' => $notification->id,
                    'user_id' => $lending->user_id,
                    'from_status' => $originalStatus,
                    'to_status' => $lending->status
                ]);

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

                    $channel = "user.{$lending->user_id}";
                    $event = 'notification.created';

                    $result = $pusher->trigger($channel, $event, $pusherData);

                    Log::info('Pusher status change notification sent successfully', [
                        'user_id' => $lending->user_id,
                        'notification_id' => $notification->id,
                        'channel' => $channel,
                        'result' => $result
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to send Pusher status change notification', [
                        'user_id' => $lending->user_id,
                        'notification_id' => $notification->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            if ($lending->status == 'returned' || $lending->status == 'returned_late') {
                // Increase book stock for each item in the lending
                foreach ($lending->item as $item) {
                    $book = Books::find($item->book_id);
                    if ($book) {
                        $book->increment('stock', (int) $item->amount);
                        Log::info('Book stock incremented after return', [
                            'book_id' => $book->id,
                            'amount' => $item->amount,
                            'new_stock' => $book->stock,
                            'lending_id' => $lending->id
                        ]);
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => $message,
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        } catch (Exception $e) {
            Log::error('Error in claim function', [
                'lending_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing the claim.',
            ], 500);
        }
    }

    // Function to update lending status to overdue for cron job
    public function updateOverdueLendings()
    {
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
                Log::info('No overdue lendings found during cron check');
                return response()->json([
                    'success' => true,
                    'message' => 'No overdue lendings found.',
                    'updated_count' => 0
                ]);
            }

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

                Log::info('Lending marked as overdue', [
                    'lending_id' => $lending->id,
                    'user_id' => $lending->user_id,
                    'transaction_id' => $lending->transaction_id,
                    'return_date' => $lending->return_date->format('Y-m-d'),
                    'days_overdue' => $daysOverdue
                ]);
            }

            DB::commit();

            // Send real-time notifications via Pusher
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

                    Log::info('Pusher overdue notification sent successfully', [
                        'user_id' => $notification->user_id,
                        'notification_id' => $notification->id,
                        'channel' => $channel
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to send Pusher overdue notification', [
                        'user_id' => $notification->user_id,
                        'notification_id' => $notification->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            Log::info('Overdue lendings cron job completed', [
                'updated_count' => $updatedCount,
                'notifications_sent' => count($notifications)
            ]);

            return response()->json([
                'success' => true,
                'message' => "Successfully updated {$updatedCount} lending(s) to overdue status.",
                'updated_count' => $updatedCount,
                'notifications_sent' => count($notifications)
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error in updateOverdueLendings cron job', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating overdue lendings.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get user lending statistics
    public function getUserLendingStats(Request $request)
    {
        $user_id = $request->user()->id;

        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated.',
            ], 401);
        }

        try {
            // Get all lending records for the user
            $totalLendings = Lending::where('user_id', $user_id)->count();

            // Get on-time returns (returned status)
            $onTimeLendings = Lending::where('user_id', $user_id)
                ->where('status', 'returned')
                ->count();

            // Get late returns (returned_late status)
            $lateLendings = Lending::where('user_id', $user_id)
                ->where('status', 'returned_late')
                ->count();

            // Get currently overdue
            $currentlyOverdue = Lending::where('user_id', $user_id)
                ->where('status', 'overdue')
                ->count();

            // Get pending lendings
            $pendingLendings = Lending::where('user_id', $user_id)
                ->where('status', 'pending')
                ->count();

            // Get approved/claimed lendings (currently borrowed)
            $claimedLendings = Lending::where('user_id', $user_id)
                ->where('status', 'claim')
                ->count();

            // Get rejected lendings
            $rejectedLendings = Lending::where('user_id', $user_id)
                ->where('status', 'reject')
                ->count();

            $stats = [
                'total_lendings' => $totalLendings,
                'on_time_returns' => $onTimeLendings,
                'late_returns' => $lateLendings,
                'currently_overdue' => $currentlyOverdue,
                'pending_approval' => $pendingLendings,
                'currently_borrowed' => $claimedLendings,
                'rejected' => $rejectedLendings,
                'completion_rate' => $totalLendings > 0 ? round((($onTimeLendings + $lateLendings) / $totalLendings) * 100, 2) : 0,
                'on_time_rate' => ($onTimeLendings + $lateLendings) > 0 ? round(($onTimeLendings / ($onTimeLendings + $lateLendings)) * 100, 2) : 0
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'User lending statistics retrieved successfully.',
            ]);
        } catch (Exception $e) {
            Log::error('Error getting user lending stats', [
                'user_id' => $user_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving lending statistics.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get all users lending statistics (admin only)
    public function getAllUsersLendingStats(Request $request)
    {
        try {
            $this->authorize('admin');

            // Get lending statistics for all users
            $userStats = DB::table('lendings')
                ->join('users', 'lendings.user_id', '=', 'users.id')
                ->select(
                    'users.id',
                    'users.name',
                    'users.email',
                    'users.uid',
                    DB::raw('COUNT(*) as total_lendings'),
                    DB::raw('SUM(CASE WHEN status = "returned" THEN 1 ELSE 0 END) as on_time_returns'),
                    DB::raw('SUM(CASE WHEN status = "returned_late" THEN 1 ELSE 0 END) as late_returns'),
                    DB::raw('SUM(CASE WHEN status = "overdue" THEN 1 ELSE 0 END) as currently_overdue'),
                    DB::raw('SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending_approval'),
                    DB::raw('SUM(CASE WHEN status = "claim" THEN 1 ELSE 0 END) as currently_borrowed'),
                    DB::raw('SUM(CASE WHEN status = "reject" THEN 1 ELSE 0 END) as rejected')
                )
                ->groupBy('users.id', 'users.name', 'users.email', 'users.uid')
                ->get();

            // Calculate rates for each user
            $userStats = $userStats->map(function ($user) {
                $totalCompleted = $user->on_time_returns + $user->late_returns;
                $user->completion_rate = $user->total_lendings > 0 ? round(($totalCompleted / $user->total_lendings) * 100, 2) : 0;
                $user->on_time_rate = $totalCompleted > 0 ? round(($user->on_time_returns / $totalCompleted) * 100, 2) : 0;
                return $user;
            });

            // Get overall statistics
            $overallStats = [
                'total_users_with_lendings' => $userStats->count(),
                'total_lendings' => $userStats->sum('total_lendings'),
                'total_on_time_returns' => $userStats->sum('on_time_returns'),
                'total_late_returns' => $userStats->sum('late_returns'),
                'total_currently_overdue' => $userStats->sum('currently_overdue'),
                'total_pending_approval' => $userStats->sum('pending_approval'),
                'total_currently_borrowed' => $userStats->sum('currently_borrowed'),
                'total_rejected' => $userStats->sum('rejected'),
            ];

            $totalCompleted = $overallStats['total_on_time_returns'] + $overallStats['total_late_returns'];
            $overallStats['overall_completion_rate'] = $overallStats['total_lendings'] > 0 ?
                round(($totalCompleted / $overallStats['total_lendings']) * 100, 2) : 0;
            $overallStats['overall_on_time_rate'] = $totalCompleted > 0 ?
                round(($overallStats['total_on_time_returns'] / $totalCompleted) * 100, 2) : 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'overall_statistics' => $overallStats,
                    'user_statistics' => $userStats
                ],
                'message' => 'All users lending statistics retrieved successfully.',
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        } catch (Exception $e) {
            Log::error('Error getting all users lending stats', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving lending statistics.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAllLendings(Request $request)
    {
        try {
            // Check if user is admin
            $this->authorize('admin');

            // Get all lending records with relationships
            $lendings = Lending::with([
                'user:id,name,email,uid,role',
                'items.book:id,title,author,img',
                'items.book.category:id,name'
            ])
                ->orderBy('created_at', 'desc')
                ->get();

            // Transform data to include image URLs
            $lendings->transform(function ($lending) {
                $lending->items->transform(function ($item) {
                    if ($item->book && $item->book->img) {
                        $item->book->img = asset('uploads/books/' . $item->book->img);
                    }
                    return $item;
                });
                return $lending;
            });

            return response()->json([
                'success' => true,
                'data' => $lendings,
                'message' => 'All lending records retrieved successfully.',
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        } catch (Exception $e) {
            Log::error('Error getting all lendings', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving lending records.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get dashboard statistics (admin only)
    public function getDashboardStats(Request $request)
    {
        try {
            $this->authorize('admin');

            // Total Books
            $totalBooks = DB::table('books')->count();

            // Total Users (non-admin)
            $totalUsers = DB::table('users')->where('role', '!=', 'admin')->count();

            // Total Lendings
            $totalLendings = Lending::count();

            // Total Returns (returned + returned_late)
            $totalReturns = Lending::whereIn('status', ['returned', 'returned_late'])->count();

            // Chart data - lending stats by month for current year
            $chartData = DB::table('lendings')
                ->select(
                    DB::raw("CAST(strftime('%m', created_at) AS INTEGER) as month"),
                    DB::raw('COUNT(*) as total'),
                    DB::raw('SUM(CASE WHEN status = "returned" THEN 1 ELSE 0 END) as returned'),
                    DB::raw('SUM(CASE WHEN status = "returned_late" THEN 1 ELSE 0 END) as late'),
                    DB::raw('SUM(CASE WHEN status = "overdue" THEN 1 ELSE 0 END) as overdue')
                )
                ->whereYear('created_at', date('Y'))
                ->groupBy(DB::raw("strftime('%m', created_at)"))
                ->orderBy('month')
                ->get();

            // Most borrowed books (top 5)
            $mostBorrowedBooks = DB::table('lending_items')
                ->join('books', 'lending_items.book_id', '=', 'books.id')
                ->join('categories', 'books.category_id', '=', 'categories.id')
                ->select(
                    'books.id',
                    'books.title',
                    'books.author',
                    'books.img',
                    'categories.name as category',
                    DB::raw('COUNT(*) as borrow_count')
                )
                ->groupBy('books.id', 'books.title', 'books.author', 'books.img', 'categories.name')
                ->orderBy('borrow_count', 'desc')
                ->limit(5)
                ->get();

            // Transform book images
            $mostBorrowedBooks = $mostBorrowedBooks->map(function ($book) {
                $book->img = $book->img ? asset('uploads/books/' . $book->img) : null;
                return $book;
            });

            // Top users with most lendings (top 5)
            $topUsers = DB::table('lendings')
                ->join('users', 'lendings.user_id', '=', 'users.id')
                ->select(
                    'users.id',
                    'users.name',
                    'users.email',
                    'users.uid',
                    'users.role',
                    DB::raw('COUNT(*) as lending_count'),
                    DB::raw('SUM(CASE WHEN status = "returned" THEN 1 ELSE 0 END) as returned_count'),
                    DB::raw('SUM(CASE WHEN status = "returned_late" THEN 1 ELSE 0 END) as late_count')
                )
                ->groupBy('users.id', 'users.name', 'users.email', 'users.uid', 'users.role')
                ->orderBy('lending_count', 'desc')
                ->limit(5)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'overview' => [
                        'total_books' => $totalBooks,
                        'total_users' => $totalUsers,
                        'total_lendings' => $totalLendings,
                        'total_returns' => $totalReturns
                    ],
                    'chart_data' => $chartData,
                    'most_borrowed_books' => $mostBorrowedBooks,
                    'top_users' => $topUsers
                ],
                'message' => 'Dashboard statistics retrieved successfully.',
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        } catch (Exception $e) {
            Log::error('Error getting dashboard stats', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving dashboard statistics.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
