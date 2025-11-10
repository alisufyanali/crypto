<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureKycIsApproved
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Agar user login nahi hai to next middleware handle karega
        if (!$user) {
            return $next($request);
        }

        // Restricted routes jahan client without approved KYC nahi ja sakta
        $restrictedRoutes = [
            'orders.*',
            'user.dashboard',
        ];

        // ✅ Agar CLIENT hai aur KYC approved nahi hai
        if (
            $user->role === 'client' &&
            $user->kyc_status !== 'approved' &&
            (
                $request->routeIs('orders.*') ||
                $request->routeIs('user.dashboard')  || 
                $request->routeIs('portfolio.*')  || 
                $request->routeIs('companies.*')  || 
               $request->routeIs('transactions.*')
            )
        ) {
            return redirect()->route('kyc.upload')
                ->with('warning', 'Access denied! Please complete your KYC before continuing.');
        }

        // ✅ Agar CLIENT ka KYC approved hai lekin upload page par ja raha hai
        if (
            $user->role === 'client' &&
            $user->kyc_status === 'approved' &&
            $request->routeIs('kyc.upload')
        ) {
            return redirect()->route('user.dashboard')
                ->with('success', 'Your KYC is approved! Welcome to your dashboard.');
        }

        return $next($request);
    }
}
