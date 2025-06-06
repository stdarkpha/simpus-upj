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
            'nim' => 'required|numeric|unique:users,nim',
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
            'nim' => $validated['nim'],
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
    public function createDosen(Request $request)
    {
        try {
            $this->authorize('admin');

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:6|confirmed',
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
                'role' => 'dosen',
            ]);

            if ($user) {
                return response()->json([
                    'success' => true,
                    'message' => 'Dosen created successfully.',
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

    // Update user (admin or self)
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $this->authorize('update', $user);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'sometimes|nullable|string|min:6|confirmed',
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

        $user->update([
            'name' => $validated['name'] ?? $user->name,
            'email' => $validated['email'] ?? $user->email,
            'password' => !empty($validated['password']) ? Hash::make($validated['password']) : $user->password,
        ]);
        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'data' => $user,
        ]);
    }

    // Delete user (admin only)
    public function destroy($id)
    {
        $this->authorize('admin');
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        $tokenName = $request->input('token_name', 'auth_token');
        $token = $request->user()->createToken($tokenName);

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
