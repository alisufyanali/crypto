<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Portfolio;
use App\Models\User;
use App\Models\Company;

class PortfoliosTableSeeder extends Seeder
{
    public function run(): void
    {
        foreach (User::all() as $user) {
            foreach (Company::all()->take(2) as $company) {
                Portfolio::create([
                    'user_id' => $user->id,
                    'company_id' => $company->id,
                    'shares_owned' => rand(10, 200),
                    'average_cost' => rand(50, 500),
                    'total_invested' => rand(5000, 50000),
                    'current_value' => rand(6000, 60000),
                    'unrealized_pnl' => rand(-1000, 2000),
                    'realized_pnl' => rand(0, 5000),
                ]);
            }
        }
    }
}
