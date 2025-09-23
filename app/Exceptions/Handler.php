<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Inertia\Inertia;

class Handler extends ExceptionHandler
{
    protected $levels = [
        // 
    ];

    protected $dontReport = [
        //
    ];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register()
    {
        //
    }

    public function render($request, Throwable $exception)
    {
        // 1️⃣ Policies & Gates Unauthorized
        if ($exception instanceof AuthorizationException) {
            if ($request->inertia()) {
                return Inertia::render('Unauthorized')->toResponse($request)
                    ->setStatusCode(403);
            }
            return response()->view('errors.403', [], 403);
        }

        // 2️⃣ Direct 403 HttpException
        if ($exception instanceof HttpException && $exception->getStatusCode() === 403) {
            if ($request->inertia()) {
                return Inertia::render('Unauthorized')->toResponse($request)
                    ->setStatusCode(403);
            }
            return response()->view('errors.403', [], 403);
        }

        return parent::render($request, $exception);
    }
}
