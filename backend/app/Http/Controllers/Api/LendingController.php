<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Books;
use App\Models\Lending;
use App\Models\LendingCart;
use App\Models\LendingItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
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
                'message' => 'Cant add book to cart, book is not available or out of stock.',
            ], 400);
        }

        $alreadyInCart = LendingCart::where('user_id', $user_id)
            ->where('book_id', $request->book_id)
            ->exists();

        if ($alreadyInCart) {
            return response()->json([
                'success' => false,
                'errors' => ['Book is already in your cart.'],
            ], 400);
        }

        $cart = LendingCart::create([
            'user_id' => $user_id,
            'book_id' => $request->book_id
        ]);

        return response()->json([
            'success' => true,
            'data' => $cart,
            'message' => 'Book added to cart successfully.',
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
                'transaction_id' => uniqid('lend_'),
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

        $lendings = Lending::where('user_id', $user_id)
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

    // get detail lending by id
    public function detail($id)
    {
        $lending = Lending::with(['items', 'user'])
            ->where('id', $id)
            ->first();

        if (!$lending) {
            return response()->json([
                'success' => false,
                'message' => 'Lending not found.',
            ], 404);
        }

        $user_name = $lending->user ? $lending->user->name : 'Unknown User';

        $qrdata = json_encode([
            'id_lending' => $lending->id,
            'transaction_id' => $lending->trasaction_id,
            'user_id' => $lending->user_id,
            'lend_date' => $lending->lend_date,
        ]);

        $lending->qr_code = QrCodeHelper::generateQR($qrdata, $user_name);

        return response()->json([
            'success' => true,
            'data' => $lending,
            'message' => 'Lending details retrieved successfully.',
        ]);
    }


    // change status lending by transaction id
    public function claim($id)
    {
        try {
            $this->authorize('admin');

            $lending = Lending::where('transaction_id', $id)->first();

            if (!$lending) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lending not found.',
                ], 404);
            }

            // Check if the lending is already claimed
            if ($lending->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Lending has already been claimed or processed.',
                ], 400);
            }

            // Update the lending status to 'claimed'
            $lending->status = 'claim';
            $lending->save();

            return response()->json([
                'success' => true,
                'message' => 'Lending claimed successfully.',
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        }
    }

    // return lending book
    public function returnBook($id)
    {
        try {
            $this->authorize('admin');

            $lending = Lending::where('transaction_id', $id)->first();

            if (!$lending) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lending not found.',
                ], 404);
            }

            // Check if the lending is already returned
            if ($lending->status === 'returned') {
                return response()->json([
                    'success' => false,
                    'message' => 'Lending has already been returned.',
                ], 400);
            }

            // Update the lending status to 'returned'
            $lending->status = 'returned';
            $lending->save();

            // Increase book stock for each item in the lending
            foreach ($lending->items as $item) {
                $book = Books::find($item->book_id);
                if ($book) {
                    $book->increment('stock', $item->amount);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Book returned successfully.',
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        }
    }
}
