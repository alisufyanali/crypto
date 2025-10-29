<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Display the contact form.
     */
    public function index(): Response
    {
        return Inertia::render('Contact');
    }

    /**
     * Store a newly created contact message.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'message' => 'required|string|max:2000',
        ]);

        try {
            // ✅ Create contact first
            $contact = Contact::create($validated);

            // ✅ Send notification to admin(s)
            createNotification(
                'admin', // role
                "New contact inquiry received from {$contact->name} ({$contact->email})", // message
                null, // user_id (null means all admins)
                'contact', // type
                'New Contact Inquiry' // title
            );

            return back()->with('success', 'Thank you for your message! We will get back to you soon.');
        } catch (\Exception $e) {
            return back()->with('error', 'Sorry, there was an error sending your message. Please try again.');
        }
    }


    /**
     * Display all contact messages (Admin only)
     */
    public function admin(): Response
    {
        $contacts = Contact::latest()->paginate(15);
        
        return Inertia::render('Admin/Contacts', [
            'contacts' => [
                'data' => $contacts->items(),
                'links' => $contacts->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $contacts->currentPage(),
                    'from' => $contacts->firstItem(),
                    'last_page' => $contacts->lastPage(),
                    'per_page' => $contacts->perPage(),
                    'to' => $contacts->lastItem(),
                    'total' => $contacts->total(),
                ]
            ]
        ]);
    }

    /**
     * Mark contact as read
     */
    public function markAsRead(Contact $contact)
    {
        $contact->update(['is_read' => true]);
        
        return back()->with('status', 'Message marked as read.');
    }

    /**
     * Delete contact message
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();
        
        return back()->with('status', 'Message deleted successfully.');
    }
}