<?php

namespace App\Exports;

use Spatie\Activitylog\Models\Activity;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class AuditLogFullExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Activity::all();
    }

    public function headings(): array
    {
        return [
            'id', 'log_name', 'description', 'subject_id', 'subject_type',
            'event', 'causer_id', 'causer_type', 'properties', 'batch_uuid',
            'created_at', 'updated_at'
        ];
    }
}
