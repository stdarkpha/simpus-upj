<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CategoriesController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // get all categories
        $categories = Categories::all();
        return response()->json([
            'success' => true,
            'data' => $categories,
            'message' => 'Categories retrieved successfully',
        ]);
    }

    // by id
    public function show($id)
    {
        // get category by id
        $category = Categories::find($id);
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Category retrieved successfully',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $this->authorize('admin');
            $validator = Validator::make($request->all(), [
                'id' => 'nullable|integer',
                'name' => 'required|string|max:255|unique:categories,name',
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
                    'message' => 'Validation failed',
                ], 422);
            }

            $validated = $validator->validated();
            $slug = Str::slug($validated['name'], '-');

            $category = Categories::updateOrCreate(
                ['id' => $validated['id'] ?? null],
                [
                    'name' => $validated['name'],
                    'slug' => $slug,
                ]
            );

            return response()->json([
                'success' => true,
                'data' => $category,
                'message' => 'Category created or updated successfully',
            ], 201);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $this->authorize('admin');
            $category = Categories::find($id);
            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found',
                ], 404);
            }
            $category->delete();
            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully',
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        }
    }
}
