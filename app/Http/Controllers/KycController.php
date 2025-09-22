<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KycDocument;
use Illuminate\Support\Facades\Storage;

class KycController extends Controller
{
    /**
     * Show KYC Upload Form + user documents
     */
    public function showUploadForm()
    {
        $docs = KycDocument::where('user_id', auth()->id())->get();

        return inertia('Kyc/Upload', [
            'documents' => $docs
        ]);
    }

    /**
     * Store / Update KYC Documents
     */
    public function store(Request $request)
    {
        $request->validate([
            'national_id' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'utility_bill' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        // ---- National ID Upload ----
        if ($request->hasFile('national_id')) {
            $file = $request->file('national_id');
            $path = $file->store('kyc', 'public');

            // delete old file if exists
            $doc = KycDocument::where('user_id', auth()->id())
                ->where('document_type', 'national_id')
                ->first();

            if ($doc && Storage::disk('public')->exists($doc->file_path)) {
                Storage::disk('public')->delete($doc->file_path);
            }

            KycDocument::updateOrCreate(
                ['user_id' => auth()->id(), 'document_type' => 'national_id'],
                [
                    'file_path' => $path,
                    'original_filename' => $file->getClientOriginalName(),
                    'status' => 'pending',
                    'rejection_reason' => null, // reset rejection reason
                ]
            );
        }

        // ---- Utility Bill Upload ----
        if ($request->hasFile('utility_bill')) {
            $file = $request->file('utility_bill');
            $path = $file->store('kyc', 'public');

            $doc = KycDocument::where('user_id', auth()->id())
                ->where('document_type', 'utility_bill')
                ->first();

            if ($doc && Storage::disk('public')->exists($doc->file_path)) {
                Storage::disk('public')->delete($doc->file_path);
            }

            KycDocument::updateOrCreate(
                ['user_id' => auth()->id(), 'document_type' => 'utility_bill'],
                [
                    'file_path' => $path,
                    'original_filename' => $file->getClientOriginalName(),
                    'status' => 'pending',
                    'rejection_reason' => null,
                ]
            );
        }

        return back()->with('success', 'KYC documents uploaded successfully.');
    }
}
