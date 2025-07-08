<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'sender_id',
        'recipient_id',
        'sender_wallet_id',
        'recipient_wallet_id',
        'amount',
        'currency',
        'description',
        'status',
        'reference_number',
        'type'
    ];
    /**
     * Get the user that initiated the Transaction
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id', 'id');
    }

    /**
     * Get the user that accepts the Transaction
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id', 'id');
    }
    /**
     * Get the wallet that sent money
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function senderWallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class, 'sender_wallet_id', 'id');
    }

    /**
     * Get the user the wallet that accepted money
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function recipientWallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class, 'recipient_wallet_id', 'id');
    }

    /**
     * Scope a query to only include completed tranasactions
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include failed transactions
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFailed($query) {
        return $query->where('status', 'failed');
    }
}
