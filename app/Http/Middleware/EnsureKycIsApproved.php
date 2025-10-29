<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureKycIsApproved
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // If approved but still on upload page → redirect to dashboard
        if ($user && $user->kyc_status === 'approved' && $request->routeIs('kyc.upload')) {
            return redirect()->route('user.dashboard')
                ->with('success', 'Your KYC is approved! Welcome to your dashboard.');
        }

        // If not approved but trying to access dashboard → send back to upload
        if ($user && $user->kyc_status !== 'approved' && $request->routeIs('user.dashboard')) {
            return redirect()->route('kyc.upload')
                ->with('warning', 'Please complete your KYC before accessing the dashboard.');
        }

        return $next($request);
    }

}
