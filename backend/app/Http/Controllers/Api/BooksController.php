<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Books;
use App\Models\Categories;
use Illuminate\Http\Request;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BooksController extends Controller
{
    use AuthorizesRequests;

    // Display a listing of the resource.
    public function index($number)
    {
        if ($number) {
            $books = Books::with('category')
                ->orderBy('created_at', 'desc')
                ->paginate($number);
        } else {
            $books = Books::with('category')
                ->orderBy('created_at', 'desc')
                ->get();
        }
        return response()->json([
            'success' => true,
            'data' => $books,
            'message' => 'Books retrieved successfully',
        ]);
    }

    // display categories include books
    public function indexByCategory()
    {
        $books = Categories::with(['books'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $books,
            'message' => 'Books retrieved successfully for category',
        ]);
    }

    // Store a newly created resource in storage.
    public function store(Request $request)
    {
        try {
            $this->authorize('admin');

            $validator = Validator::make($request->all(), [
                'id' => 'nullable|integer',
                'img' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'title' => 'required|string|max:255',
                'author' => 'nullable|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'stock' => 'required|integer|min:1',
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
            $slug = Str::slug($request->input('title'), '-');

            $books = Books::updateOrCreate(
                ['id' => $request->input('id')],
                array_merge(
                    $validator->validated(),
                    [
                        'slug' => $slug,
                    ]
                )
            );

            // Handle image upload if provided
            if ($request->hasFile('img')) {
                // Check if updating and remove old image if exists
                if ($request->id && $books->img) {
                    $old_image_path = public_path('uploads/books/' . $books->img);
                    if (file_exists($old_image_path)) {
                        unlink($old_image_path);
                    }
                }

                $img = $request->file('img');
                $img_name = time() . '.' . $img->extension();
                $img->move(public_path('uploads/books/'), $img_name);
                $books->img = $img_name;
                $books->save();
            }

            return response()->json([
                'success' => true,
                'data' => $books,
                'message' => 'Book created or updated successfully',
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        }
    }

    // Display the specified resource.
    public function show($id)
    {
        $book = Books::with('category')->find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Book not found',
            ], 404);
        }

        $img_url = $book->img ? asset('uploads/books/' . $book->img) : null;
        $book->img = $img_url; // Add img_url to the book data

        return response()->json([
            'success' => true,
            'data' => $book,
            'message' => 'Book retrieved successfully',
        ]);
    }

    // show by slug
    public function showBySlug($slug)
    {
        $book = Books::with('category')->where('slug', $slug)->first();

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Book not found',
            ], 404);
        }

        $img_url = $book->img ? asset('uploads/books/' . $book->img) : null;
        $book->img = $img_url;

        return response()->json([
            'success' => true,
            'data' => $book,
            'message' => 'Book retrieved successfully',
        ]);
    }

    // Remove the specified resource from storage.
    public function destroy($id)
    {
        try {
            $this->authorize('admin');

            $book = Books::find($id);
            if (!$book) {
                return response()->json([
                    'success' => false,
                    'message' => 'Book not found',
                ], 404);
            }

            // Delete the book image if it exists
            if ($book->img) {
                $image_path = public_path('uploads/books/' . $book->img);
                if (file_exists($image_path)) {
                    unlink($image_path);
                }
            }

            $book->delete();

            return response()->json([
                'success' => true,
                'message' => 'Book deleted successfully',
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        }
    }
}
