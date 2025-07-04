<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Auth\Access\AuthorizationException;

class UserController extends Controller
{
    use AuthorizesRequests;
    // List all users (admin only)
    public function index()
    {
        try {
            $this->authorize('admin');
            return response()->json([
                'success' => true,
                'data' => User::all(),
                'message' => 'List of all users',
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        }
    }

    // Register mahasiswa (user self-register)
    public function registerMahasiswa(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'uid' => 'required|numeric|unique:users,uid',
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

        $validated = $validator->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'mahasiswa',
            'uid' => $validated['uid'],
        ]);

        if ($user) {
            return response()->json([
                'success' => true,
                'message' => 'Registration successful.',
                'data' => $user,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed.',
            ], 201);
        }
    }

    // Admin creates dosen user
    public function store(Request $request)
    {
        try {
            $this->authorize('admin');

            $validator = Validator::make($request->all(), [
                'id' => 'nullable|integer',
                'name' => 'required|string|max:255',
                'uid' => 'nullable|string',
                'email' => 'required|email',
                'password' => 'nullable|string|min:6|confirmed',
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
                ]);
            }

            $validated = $validator->validated();

            $updateData = [
                'email' => $validated['email'],
                'name' => $validated['name'],
                'role' => 'dosen',
                'uid' => $validated['uid'] ?? null,
            ];

            if (!empty($validated['password'])) {
                $updateData['password'] = Hash::make($validated['password']);
            }

            $user = User::updateOrCreate(
                ['id' => $validated['id']],
                $updateData
            );

            if ($user) {
                $message = $validated['id'] ? $user->role . ' updated successfully.' : $user->role . ' created successfully.';
                return response()->json([
                    'success' => true,
                    'message' => $message,
                    'data' => $user,
                ], 201);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create dosen.',
                ], 201);
            }
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        }
    }

    public function detail(Request $request)
    {
        if ($request->user()) {
            return response()->json([
                'success' => true,
                'data' => $request->user(),
                'message' => 'User details retrieved successfully.',
            ]);
        }

        return response()->json([
            'message' => 'Unauthorized',
            'errors' => ['user' => 'You must be logged in to view user details.']
        ], 401);
    }

    // Show user detail (admin or self)
    public function show($id)
    {
        try {
            $this->authorize('admin');
            $user = User::findOrFail($id);
            if ($user) {
                return response()->json([
                    'success' => true,
                    'data' => $user,
                    'message' => 'User details retrieved successfully.',
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found.',
                ], 404);
            }
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        }
    }

    // Delete user (admin only)
    public function destroy($id)
    {
        $this->authorize('admin');
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json([
            'success' => true,
            'message' => 'User deleted'
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();
        $tokenName = $request->input('token_name', 'auth_token');
        $token = $request->user()->createToken($tokenName);
        $user->token = $token->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
