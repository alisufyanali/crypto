<?php

namespace App\Exports;

use Spatie\Activitylog\Models\Activity;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Http\Request;

class AuditLogExport implements FromCollection, WithHeadings
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function collection()
    {
        $query = Activity::query()->with('causer');

        if ($this->request->filled('user_id')) {
            $query->where('causer_id', $this->request->user_id);
        }

        if ($this->request->filled('event')) {
            $query->where('event', $this->request->event);
        }

        if ($this->request->filled('subject_type')) {
            $query->where('subject_type', $this->request->subject_type);
        }

        return $query->get()->map(function ($log, $index) {
            return [
                'Sr. No'   => $index + 1,
                'User'     => $log->causer ? $log->causer->name : 'System',
                'Operation'=> $log->event,
                'Subject'  => class_basename($log->subject_type),
                'Date'     => $log->created_at->format('Y-m-d H:i:s'),
            ];
        });
    }

    public function headings(): array
    {
        return ['Sr. No', 'User', 'Operation', 'Subject', 'Date'];
    }
}
