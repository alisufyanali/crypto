<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;
use Faker\Factory as Faker;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Agar users table mein koi user nahi hai to dummy user create karein
        if (User::count() === 0) {
            User::factory()->count(3)->create();
        }

        $users = User::all();

        foreach (range(1, 10) as $index) {
            $user = $users->random();

            Notification::create([
                'user_id' => $user->id,
                'role' => $user->role ?? 'user',
                'type' => $faker->randomElement(['general', 'system', 'alert']),
                'title' => $faker->sentence(3),
                'message' => $faker->paragraph(),
                'is_read' => $faker->boolean(30), // 30% chance read
            ]);
        }
    }
}
