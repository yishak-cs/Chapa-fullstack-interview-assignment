<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Transaction;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\TransactionRequest;
use Illuminate\Support\Facades\Gate;

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


    public function handleTransaction(TransactionRequest $request)
    {
        Gate::authorize('create', Transaction::class);
        try {
            // Start database transaction for atomic operation
            DB::beginTransaction();

            $validatedData = $request->validated();
            $sender = $request->input('sender');
            $recipient = $request->input('recipient');
            $senderWallet = $request->input('senderWallet');
            $recipientWallet = $request->input('recipientWallet');

            $amount = $validatedData['amount'];
            $currency = $validatedData['currency'];
            $description = $validatedData['description'] ?? null;

            // Generate unique reference number
            $referenceNumber = $this->generateReferenceNumber();

            // Update wallet balances
            $senderWallet->decrement('balance', $amount);
            $recipientWallet->increment('balance', $amount);

            // Create transaction record
            $transaction = Transaction::create([
                'sender_id' => $sender->id,
                'recipient_id' => $recipient->id,
                'sender_wallet_id' => $senderWallet->id,
                'recipient_wallet_id' => $recipientWallet->id,
                'amount' => $amount,
                'currency' => $currency,
                'description' => $description,
                'status' => 'completed',
                'reference_number' => $referenceNumber,
            ]);

            DB::commit();

            // Return success response with transaction data
            return response()->json([
                'success' => true,
                'message' => 'Transaction completed successfully.',
                'data' => [
                    'transaction' => $transaction->load(['sender', 'recipient']),
                    'new_balance' => $senderWallet->fresh()->balance,
                    'reference_number' => $referenceNumber,
                ]
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Transaction failed. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Generate unique reference number for transaction
     */
    private function generateReferenceNumber(): string
    {
        do {
            $referenceNumber = 'TXN' . strtoupper(Str::random(8)) . time();
        } while (Transaction::where('reference_number', $referenceNumber)->exists());

        return $referenceNumber;
    }
}
