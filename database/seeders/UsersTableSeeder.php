<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '03001234567',
            'address' => 'Karachi, Pakistan',
            'national_id' => '42101-1234567-1',
            'kyc_status' => 'approved',
            'is_active' => true,
        ]);

        User::factory()->count(10)->create();
    }
}
