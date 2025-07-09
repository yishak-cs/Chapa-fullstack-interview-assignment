<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class TransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'recipientId' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'required|string|max:3',
            'description' => 'nullable|string|max:500',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $this->validateTransactionRequirements($validator);
        });
    }

    /**
     * Validate complex transaction requirements
     */
    private function validateTransactionRequirements($validator)
    {
        $sender = Auth::user();
        $recipientId = $this->get('recipientId');
        $amount = $this->get('amount');

        // Check if sender is trying to send money to themselves
        if ($sender->id == $recipientId) {
            $validator->errors()->add('recipientId', 'You cannot send money to yourself.');
            return;
        }

        // Get recipient user
        $recipient = User::find($recipientId);
        if (!$recipient) {
            $validator->errors()->add('recipientId', 'Recipient user not found.');
            return;
        }

        // Check if recipient is active
        if (!$recipient->is_active) {
            $validator->errors()->add('recipientId', 'Recipient account is not active.');
            return;
        }

        // Get sender's wallet
        $senderWallet = $sender->wallet;
        if (!$senderWallet) {
            $validator->errors()->add('amount', 'Sender wallet not found.');
            return;
        }

        // Check if sender's wallet is active
        if (!$senderWallet->is_active) {
            $validator->errors()->add('amount', 'Your wallet is not active.');
            return;
        }

        // Check if sender has sufficient balance
        if ($senderWallet->balance < $amount) {
            $validator->errors()->add('amount', 'Insufficient wallet balance.');
            return;
        }

        // Get recipient's wallet
        $recipientWallet = $recipient->wallet;
        if (!$recipientWallet) {
            $validator->errors()->add('recipientId', 'Recipient wallet not found.');
            return;
        }

        // Check if recipient's wallet is active
        if (!$recipientWallet->is_active) {
            $validator->errors()->add('recipientId', 'Recipient wallet is not active.');
            return;
        }

        // Store validated data for use in controller (replace input)
        $this->replace(array_merge($this->all(), [
            'sender' => $sender,
            'recipient' => $recipient,
            'senderWallet' => $senderWallet,
            'recipientWallet' => $recipientWallet,
        ]));
    }

    /**
     * Get custom error messages
     */
    public function messages(): array
    {
        return [
            'recipientId.required' => 'Please select a recipient.',
            'recipientId.exists' => 'The selected recipient does not exist.',
            'amount.required' => 'Please enter an amount.',
            'amount.numeric' => 'Amount must be a valid number.',
            'amount.min' => 'Amount must be at least 0.01.',
            'currency.required' => 'Currency is required.',
            'currency.max' => 'Currency code must not exceed 3 characters.',
        ];
    }
}