<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function dashboard()
    {
        $user = Auth::user();
        $role = $user->role;

        $data = $this->getDashboardData($user, $role);

        return Inertia::render("{$role}/Dashboard", $data);
    }

    private function getDashboardData(User $user, string $role): array
    {
        $baseData = [
            'user' => $user,
        ];

        return match ($role) {
            'super_admin' => array_merge($baseData, $this->getSuperAdminData()),
            'admin' => array_merge($baseData, $this->getAdminData($user)),
            'user' => array_merge($baseData, $this->getUserData($user)),
        };
    }

    private function getUserData(User $user): array
    {
        return [
            'wallet' => $user->wallet,
            'transactions' => $user->allTransactions()->with(['sender', 'recipient'])->get(),
            'stats' => [
                'totalSent' => $user->sentTransactions()->sum('amount'),
                'totalReceived' => $user->receivedTransations()->sum('amount'),
                'transactionCount' => $user->allTransactions()->count(),
            ]
        ];
    }

    private function getAdminData(User $admin): array
    {
        $managedUsers = $admin->managedUsers()->get();
        $managedUserIds = $managedUsers->pluck('id');

        // Get all transactions where sender or recipient is one of the managed users
        $managedUsersTransactions = Transaction::where(function ($query) use ($managedUserIds) {
            $query->whereIn('sender_id', $managedUserIds)
                ->orWhereIn('recipient_id', $managedUserIds);
        })
            ->with([
                'sender:id,name,email',
                'recipient:id,name,email',
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        $totalAmountProcessed = $managedUsersTransactions->sum('amount');

        $totalManagedUsersBalance = Wallet::whereIn('user_id', $managedUsers->pluck('id'))->sum('balance');

        return [
            'managedUsers' => $managedUsers,
            'managedUsersTransactions' => $managedUsersTransactions,
            'stats' => [
                'totalManagedUsers' => $managedUsers->count(),
                'activeManagedUsers' => $managedUsers->where('is_active', true)->count(),
                'NumberOfTransactions'=>$managedUsersTransactions->count(),
                'totalAmountProcessed' => $totalAmountProcessed,
                'totalManagedUsersBalance' => $totalManagedUsersBalance,
            ]
        ];
    }

    private function getSuperAdminData(): array
    {
        // Get all transactions in the system
        $allTransactions = Transaction::with([
            'sender:id,name,email',
            'recipient:id,name,email',
        ])
            ->orderBy('created_at', 'desc')
            ->get();

        return [
            'allTransactions' => $allTransactions,
            'stats' => [
                'totalUsers' => User::count(),
                'totalAdmins' => User::where('role', 'admin')->count(),
                'totalRegularUsers' => User::where('role', 'user')->count(),
                'activeUsers' => User::where('is_active', true)->count(),
                'inactiveUsers' => User::where('is_active', false)->count(),
                'totalTransactions' => $allTransactions->count(),
                'totalAmountProcessed' => $allTransactions->sum('amount'),
                'totalSystemBalance' => Wallet::sum('balance'),
                'todaysTransactions' => Transaction::whereDate('created_at', today())->count(),
                'todaysAmount' => Transaction::whereDate('created_at', today())->sum('amount'),
            ]
        ];
    }
}
