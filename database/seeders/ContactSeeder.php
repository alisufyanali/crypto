<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contacts = [
            [
                'name' => 'John Doe',
                'company_name' => 'ABC Corp',
                'email' => 'john@abccorp.com',
                'phone' => '+1234567890',
                'message' => 'I am interested in your cryptocurrency trading platform. Could you please provide more information about the fees and supported currencies?',
                'is_read' => false,
            ],
            [
                'name' => 'Sarah Smith',
                'company_name' => 'Tech Solutions Ltd',
                'email' => 'sarah@techsolutions.com',
                'phone' => '+1987654321',
                'message' => 'We are looking for a reliable partner for crypto investments. Would like to schedule a meeting to discuss our requirements.',
                'is_read' => true,
            ],
            [
                'name' => 'Ahmed Hassan',
                'company_name' => 'Digital Ventures',
                'email' => 'ahmed@digitalventures.com',
                'phone' => '+92300123456',
                'message' => 'Hello, I want to know about the minimum investment amount and the available trading pairs on your platform.',
                'is_read' => false,
            ],
        ];

        foreach ($contacts as $contact) {
            Contact::create($contact);
        }
    }
}