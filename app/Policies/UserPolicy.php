<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     * Only active users can view any users.
     */
    public function viewAny(User $user): bool
    {
        return (bool) $user->is_active;
    }

    /**
     * Determine whether the user can view the model.
     * super_admin: can view any user
     * admin: can view users they manage
     */
    public function view(User $user, User $targetUser): bool
    {
        if ($user->role === 'super_admin') {
            return true;
        }
        if ($user->role === 'admin') {
            return $targetUser->admin_id === $user->id;
        }
        return false;
    }

    /**
     * Determine whether the user can create models.
     * super_admin: can create admin accounts
     * admin: can create user accounts
     */
    public function create(User $user, ?string $role = null): bool
    {
        if ($user->role === 'super_admin') {
            return $role === 'admin';
        }
        if ($user->role === 'admin') {
            return $role === 'user';
        }
        return false;
    }

    /**
     * Determine whether the user can update the model (activate/deactivate).
     * super_admin: can update any user
     * admin: can update users they manage
     */
    public function update(User $user, User $targetUser): bool
    {
        if ($user->role === 'super_admin') {
            return true;
        }
        if ($user->role === 'admin') {
            return $targetUser->admin_id === $user->id;
        }
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $targetUser): bool
    {
        return $user->role === 'super_admin';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $targetUser): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $targetUser): bool
    {
        return false;
    }
}
