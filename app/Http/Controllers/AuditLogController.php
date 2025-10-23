<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AuditLogExport;
use App\Exports\AuditLogFullExport;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::query()->with('causer');

        // Filters
        if ($request->filled('user_id')) {
            $query->where('causer_id', $request->user_id);
        }

        if ($request->filled('event')) {
            $query->where('event', $request->event);
        }

        if ($request->filled('subject_type')) {
            $query->where('subject_type', $request->subject_type);
        }

        $perPage = $request->input('per_page', 25);

        $logs = $query->latest()->paginate($perPage)->appends($request->all());

        return inertia('AuditLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['user_id', 'event', 'subject_type', 'per_page']),
        ]);
    }

    // Filtered export
    public function export(Request $request)
    {
        return Excel::download(new AuditLogExport($request), 'audit_logs.xlsx');
    }

    // Full export
    public function exportFull()
    {
        return Excel::download(new AuditLogFullExport, 'audit_logs_full.xlsx');
    }
}
