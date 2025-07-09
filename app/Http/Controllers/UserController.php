<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // List users: super_admin sees all, admin sees managed users
    public function index()
    {
        Gate::authorize('viewAny', User::class);
        $role = Auth::user()->role;
        $users = Auth::user()->getAllManagedUsers();
        return Inertia::render("{$role}/Users", [
            'users' => $users
        ]);
    }

    // Create a user (admin creates user, super_admin creates admin)
    public function store(Request $request)
    {
        Gate::authorize('create', [User::class, $request->input('role')]);
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => ['required','confirmed', Rules\Password::defaults()],
                'role' => 'required|in:user,admin',
            ]);
            $validated['is_active'] = true;
            if (Auth::user()->role === 'admin') {
                $validated['admin_id'] = Auth::id();
            }
            $user = User::create($validated);
            return response()->json([
                'message' => 'User created successfully',
                'data' => $user
            ], Response::HTTP_OK);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'User creation failed: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function show(User $user)
    {
        Gate::authorize('view', $user);

        $user->load([
            'admin'
        ]);

        return response()->json([
            'data' => $user
        ]);
    }

    // Update: only activation/deactivation
    public function update(Request $request, User $user)
    {
        Gate::authorize('update', $user);
        try {
            $validated =  $request->validate([
                'is_active' => 'required|boolean',
            ]);

            $user->update([
                'is_active' => $validated['is_active']
            ]);
            return response()->json([
                'message' => 'User updated successfully',
            ], Response::HTTP_OK);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'User update failed: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete', $user);
        try {
            $user->delete();
            return response()->json([
                'message' => 'User deleted successfully'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'User deletion failed: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
