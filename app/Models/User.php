<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
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
        return $this->hasOne(User::class, 'user_id', 'id');
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
        return $this->hasMany(Transaction::class, 'receipeint_id', 'id');
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

    public function getAllManagedUsers()
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
