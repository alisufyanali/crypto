<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OtherController extends Controller
{
    /**
     * Display the contact form.
     */
    public function about(): Response
    {
        return Inertia::render('Other/About');
    }
 
}