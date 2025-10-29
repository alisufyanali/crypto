<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\KycDocument;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;


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
        $user = auth()->user();
        $uploaded = [];

        // ---- National ID Upload ----
        if ($request->hasFile('national_id')) {
            $file = $request->file('national_id');
            $path = $file->store('kyc', 'public');

            // delete old file if exists
            $doc = KycDocument::where('user_id', $user->id)
                ->where('document_type', 'national_id')
                ->first();

            if ($doc && Storage::disk('public')->exists($doc->file_path)) {
                Storage::disk('public')->delete($doc->file_path);
            }

            KycDocument::updateOrCreate(
                ['user_id' => $user->id, 'document_type' => 'national_id'],
                [
                    'file_path' => $path,
                    'original_filename' => $file->getClientOriginalName(),
                    'status' => 'pending',
                    'rejection_reason' => null,
                ]
            );

            $uploaded[] = 'National ID';
        }

        // ---- Utility Bill Upload ----
        if ($request->hasFile('utility_bill')) {
            $file = $request->file('utility_bill');
            $path = $file->store('kyc', 'public');

            $doc = KycDocument::where('user_id', $user->id)
                ->where('document_type', 'utility_bill')
                ->first();

            if ($doc && Storage::disk('public')->exists($doc->file_path)) {
                Storage::disk('public')->delete($doc->file_path);
            }

            KycDocument::updateOrCreate(
                ['user_id' => $user->id, 'document_type' => 'utility_bill'],
                [
                    'file_path' => $path,
                    'original_filename' => $file->getClientOriginalName(),
                    'status' => 'pending',
                    'rejection_reason' => null,
                ]
            );

            $uploaded[] = 'Utility Bill';
        }

        // ✅ Notify Admin (ID = 1)
        if (!empty($uploaded)) {
            $docs = implode(' & ', $uploaded);
            createNotification(
                'admin',
                "{$user->name} uploaded {$docs} for KYC verification.",
                1, // Admin ID
                'kyc',
                'New KYC Submission'
            );
        }

        return back()->with('success', 'KYC documents uploaded successfully.');
    }

     public function approve(KycDocument $document)
    {
        $document->update([
            'status' => 'approved',
            'rejection_reason' => null,
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        // ✅ Send notification to that user
        createNotification(
            null,
            "Your {$document->document_type} has been approved by the admin.",
            $document->user_id,
            'kyc',
            'KYC Approved'
        );

        return back()->with('success', 'Document approved successfully.');
    }


    public function reject(Request $request, KycDocument $document)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $document->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        // ✅ Send notification to that user
        createNotification(
            null,
            "Your {$document->document_type} has been rejected. Reason: {$request->reason}",
            $document->user_id,
            'kyc',
            'KYC Rejected'
        );

        return back()->with('success', 'Document rejected successfully.');
    }

    public function reset(KycDocument $doc)
    {
        $doc->update([
            'status' => 'pending',
            'rejection_reason' => null,
            'reviewed_by' => null,
            'reviewed_at' => null,
        ]);
        return back()->with('success', 'KYC document reset to pending.');
    }



}
