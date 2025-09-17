<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Stock;
use App\Models\Company;

class StocksTableSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Company::all() as $company) {
            Stock::create([
                'company_id' => $company->id,
                'current_price' => rand(50, 500),
                'previous_close' => rand(50, 500),
                'day_high' => rand(100, 600),
                'day_low' => rand(40, 90),
                'volume' => rand(1000, 50000),
                'change_amount' => rand(-20, 20),
                'change_percentage' => rand(-10, 10),
            ]);
        }
    }
}
