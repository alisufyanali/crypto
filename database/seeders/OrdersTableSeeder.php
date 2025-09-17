<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\User;
use App\Models\Company;
use Illuminate\Support\Str;

class OrdersTableSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $companies = Company::all();

        foreach ($users as $user) {
            foreach ($companies as $company) {
                Order::create([
                    'order_number' => strtoupper(Str::random(10)),
                    'user_id' => $user->id,
                    'company_id' => $company->id,
                    'type' => ['buy', 'sell'][rand(0,1)],
                    'quantity' => rand(10, 100),
                    'price_per_share' => rand(50, 500),
                    'total_amount' => rand(5000, 50000),
                    'status' => 'pending',
                ]);
            }
        }
    }
}
