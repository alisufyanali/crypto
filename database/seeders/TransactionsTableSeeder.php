<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Order;
use Illuminate\Support\Str;

class TransactionsTableSeeder extends Seeder
{
    public function run(): void
    {
        foreach (User::all() as $user) {
            Transaction::create([
                'transaction_id' => strtoupper(Str::random(12)),
                'user_id' => $user->id,
                'order_id' => Order::inRandomOrder()->first()?->id,
                'type' => ['deposit', 'withdrawal', 'buy', 'sell', 'dividend'][rand(0,4)],
                'amount' => rand(1000, 10000),
                'description' => 'Test transaction for user ' . $user->id,
                'metadata' => json_encode(['ip' => '127.0.0.1']),
            ]);
        }
    }
}
