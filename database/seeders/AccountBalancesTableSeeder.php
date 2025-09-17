<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AccountBalance;
use App\Models\User;

class AccountBalancesTableSeeder extends Seeder
{
    public function run(): void
    {
        foreach (User::all() as $user) {
            AccountBalance::create([
                'user_id' => $user->id,
                'cash_balance' => rand(10000, 100000),
                'invested_amount' => rand(5000, 50000),
                'total_portfolio_value' => rand(15000, 150000),
                'total_pnl' => rand(-2000, 10000),
            ]);
        }
    }
}
