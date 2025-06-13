<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CategoriesController;
use App\Http\Controllers\Api\BooksController;
use App\Http\Controllers\Api\LendingController;


Route::post('/user/register', [UserController::class, 'registerMahasiswa']);
Route::post('/user/login', [UserController::class, 'login']);

// List all categories
Route::get('/categories', [CategoriesController::class, 'index']);

// List all books
Route::get('/books', [BooksController::class, 'index']);
// List books by category
Route::get('/books/category', [BooksController::class, 'indexByCategory']);
// show book detail
Route::get('/books/slug/{slug}', [BooksController::class, 'showBySlug']);
// book search
Route::get('/books/search', [BooksController::class, 'search']);


Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('user')->group(function () {
        // Show user detail (admin or self)
        Route::get('/list', [UserController::class, 'index']);
        Route::get('/', [UserController::class, 'detail']);
        Route::post('/logout', [UserController::class, 'logout']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::post('/store', [UserController::class, 'store']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });

    Route::prefix('categories')->group(function () {
        // Create or update a category (admin only)
        Route::post('/', [CategoriesController::class, 'store']);
        // Show category detail by ID
        Route::get('/{id}', [CategoriesController::class, 'show']);
        // Delete a category (admin only)
        Route::delete('/{id}', [CategoriesController::class, 'destroy']);
    });

    // books
    Route::prefix('books')->group(function () {
        // Create or update a book (admin only)
        Route::post('/', [BooksController::class, 'store']);
        // Delete a book (admin only)
        Route::delete('/{id}', [BooksController::class, 'destroy']);
        // Show book detail
        Route::get('/detail/{id}', [BooksController::class, 'show']);
    });

    // lending
    Route::prefix('lending')->group(function () {
        // Add book to lending cart
        Route::post('/cart', [LendingController::class, 'addToCart']);
        // Show lending cart
        Route::get('/cart', [LendingController::class, 'viewCart']);
        // Clear lending cart
        Route::delete('/cart/clear', [LendingController::class, 'clearCart']);
        // Remove book from lending cart
        Route::delete('/cart/{id}', [LendingController::class, 'removeFromCart']);
        // checkout lending cart
        Route::post('/confirm', [LendingController::class, 'confirm']);
        // Show lending history
        Route::get('/history', [LendingController::class, 'history']);
        // Show lending history by user ID
        Route::get('/reminder', [LendingController::class, 'reminderLending']);
        // Show lending detail by ID
        Route::get('/history/{id}', [LendingController::class, 'detail']);
        // claim book
        Route::post('/claim/{id}', [LendingController::class, 'claim']);
        // return book
        Route::post('/return/{id}', [LendingController::class, 'returnBook']);
    });
});
