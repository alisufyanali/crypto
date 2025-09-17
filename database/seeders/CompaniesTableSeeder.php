<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;

class CompaniesTableSeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            ['name' => 'Bank Karachi', 'symbol' => 'BK', 'sector' => 'Banking', 'market_cap' => 1000000000, 'shares_outstanding' => 10000000],
            ['name' => 'Broadway Developers', 'symbol' => 'BRD', 'sector' => 'Real Estate', 'market_cap' => 500000000, 'shares_outstanding' => 5000000],
            ['name' => 'TechSoft', 'symbol' => 'TS', 'sector' => 'Technology', 'market_cap' => 2000000000, 'shares_outstanding' => 20000000],
        ];

        foreach ($companies as $c) {
            Company::create($c);
        }
    }
}
