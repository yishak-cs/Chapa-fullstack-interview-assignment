<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'dashboard'])
    ->middleware(['auth', 'verified', 'check.active'])
    ->name('dashboard');
Route::middleware('auth')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/user/{user}', [UserController::class, 'show']);
    Route::post('/user/add', [UserController::class, 'store']);
    Route::delete('/user/delete/{user}', [UserController::class, 'destroy']);
    Route::patch('/user/{user}/update', [UserController::class, 'update']);
    Route::get('/candidates', function () {
        $currentUserId = Auth::user()->id;
        return \App\Models\User::where('role', 'user')
            ->where('is_active', true)
            ->where('id', '!=', $currentUserId)

            ->get(['id', 'name']);
    });
    Route::get('/transaction/{transaction}', [TransactionController::class, 'show']);
    Route::post('/processTransaction', [TransactionController::class, 'handleTransaction']);
});


require __DIR__ . '/auth.php';
