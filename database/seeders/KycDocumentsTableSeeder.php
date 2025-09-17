<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\KycDocument;
use App\Models\User;

class KycDocumentsTableSeeder extends Seeder
{
    public function run(): void
    {
        foreach (User::all() as $user) {
            KycDocument::create([
                'user_id' => $user->id,
                'document_type' => 'national_id',
                'file_path' => 'uploads/kyc/' . $user->id . '_nid.png',
                'original_filename' => 'nid.png',
                'status' => 'approved',
            ]);
        }
    }
}
