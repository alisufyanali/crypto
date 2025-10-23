<?php
namespace App\Exports;

use Spatie\Activitylog\Models\Activity;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class AuditReportExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Activity::with('causer.roles')->latest()->get()->map(function ($activity) {
            return [
                'User'       => $activity->causer?->name,
                'Role'       => $activity->causer?->roles->pluck('name')->join(', '),
                'Action'     => ucfirst($activity->event),
                'Model'      => class_basename($activity->subject_type),
                'Old Values' => $activity->properties['old']['title'] ?? '',
                'New Values' => $activity->properties['attributes']['title'] ?? '',
                'Date'       => $activity->created_at->format('d-M-Y h:i A'),
            ];
        });
    }

    public function headings(): array
    {
        return ['User', 'Role', 'Action', 'Model', 'Old Values', 'New Values', 'Date'];
    }
}
