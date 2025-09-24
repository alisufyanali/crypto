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
            Contact::create($validated);

            return back()->with('status', 'Thank you for your message! We will get back to you soon.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Sorry, there was an error sending your message. Please try again.']);
        }
    }

    /**
     * Display all contact messages (Admin only)
     */
    public function admin(): Response
    {
        $contacts = Contact::latest()->paginate(15);
        
        return Inertia::render('Admin/Contacts', [
            'contacts' => $contacts
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