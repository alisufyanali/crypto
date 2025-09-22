<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureKycIsApproved
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // If user logged in but KYC not approved
        if ($user && $user->kyc_status !== 'approved') {
            return redirect()->route('kyc.upload')
                ->with('warning', 'Please complete KYC verification before accessing the dashboard.');
        }

        return $next($request);
    }
}
