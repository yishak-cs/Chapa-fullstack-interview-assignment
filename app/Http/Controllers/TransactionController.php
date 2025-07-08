<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function show(Transaction $transaction)
    {
        $this->authorize('view', $transaction);

        // eager load related models
        $transaction->load([
            'sender:id,name,email',
            'recipient:id,name,email',
        ]);

        $role = Auth::user()->role;

        return Inertia::render("{$role}/Transaction", [
            'transaction' => $transaction
        ]);
    }


    public function handleTransaction(Request $request)
    {
        $this->authorize('create', Transaction::class);
    }
}
