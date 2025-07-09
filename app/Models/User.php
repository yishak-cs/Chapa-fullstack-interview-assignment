<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'admin_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected static function booted()
    {
        static::created(function ($user) {
            //create wallet for role 'user' 
            if ($user->role === 'user') {
                $user->wallet()->create([
                    'balance' => 1000.00,
                    'currency' => 'birr',
                    'is_active' => true,
                ]);
            }
        });

        static::updated(function ($user) {
            if ($user->role === 'admin' && $user->isDirty('is_active')) {
                $user->managedUsers()->update(['is_active' => $user->is_active]);
            }
        });
    }

    /**
     * Get the admin that owns the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id', 'id');
    }

    /**
     * Get all of the Users managed by the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function managedUsers(): HasMany
    {
        return $this->hasMany(User::class, 'admin_id', 'id');
    }

    /**
     * Get the wallet associated with the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function wallet(): HasOne
    {
        return $this->hasOne(wallet::class, 'user_id', 'id');
    }

    /**
     * Get all of the Transactions where the User is teh sender
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function sentTransactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'sender_id', 'id');
    }

    /**
     * Get all of the Transations the User is the recipient
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function receivedTransations(): HasMany
    {
        return $this->hasMany(Transaction::class, 'recipient_id', 'id');
    }

    /**
     * Get all transactions associated with this user, both sent and received
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function allTransactions()
    {
        return Transaction::where(function ($query) {
            $query->where('sender_id', $this->id)
                ->orWhere('recipient_id', $this->id);
        })->orderBy('created_at', 'desc');
    }
    /**
     * Get all users managed by this user based on their role
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllManagedUsers(): \Illuminate\Support\Collection
    {
        if ($this->role === 'super_admin') {
            return User::all();
        } elseif ($this->role === 'admin') {
            return $this->managedUsers;
        } else {
            return collect([$this]); // User sees only themselves
        }
    }
}
