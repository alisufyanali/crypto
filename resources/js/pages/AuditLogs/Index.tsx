import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Download, Filter } from 'lucide-react';
import { route } from 'ziggy-js';

interface AuditLog {
    id: number;
    causer?: {
        name: string;
    };
    event: string;
    subject_type: string;
    created_at: string;
}

interface PaginatedLogs {
    data: AuditLog[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}


interface Props extends Record<string, any> {
    logs: PaginatedLogs;
    filters: {
        user_id?: string;
        event?: string;
        subject_type?: string;
        per_page?: number;
    };
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Audit Logs',
        href: '#',
    },
];

export default function Index() {
    const { logs, filters } = usePage<Props>().props;

    const [formData, setFormData] = useState({
        user_id: filters.user_id || '',
        event: filters.event || '',
        subject_type: filters.subject_type || '',
        per_page: filters.per_page || 25,
    });

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('audit.logs.index'), formData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = () => {
        window.location.href = route('audit.logs.export', filters);
    };

    const handleExportFull = () => {
        window.location.href = route('audit.logs.exportFull');
    };

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audit Logs" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-white p-6 dark:bg-gray-900">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h2>

                {/* Filter Form */}
                <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 md:grid-cols-5">
                        {/* User ID Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="user_id">User ID</Label>
                            <Input
                                id="user_id"
                                type="text"
                                placeholder="Filter by User ID"
                                value={formData.user_id}
                                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                            />
                        </div>

                        {/* Event Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="event">Event</Label>
                            <Select
                                value={formData.event || 'all'}
                                onValueChange={(value) => setFormData({ ...formData, event: value === 'all' ? '' : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Events" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Events</SelectItem>
                                    <SelectItem value="created">Created</SelectItem>
                                    <SelectItem value="updated">Updated</SelectItem>
                                    <SelectItem value="deleted">Deleted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Subject Type Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="subject_type">Subject Type</Label>
                            <Input
                                id="subject_type"
                                type="text"
                                placeholder="Filter by Subject"
                                value={formData.subject_type}
                                onChange={(e) => setFormData({ ...formData, subject_type: e.target.value })}
                            />
                        </div>

                        {/* Per Page Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="per_page">Per Page</Label>
                            <Select
                                value={formData.per_page.toString()}
                                onValueChange={(value) => setFormData({ ...formData, per_page: parseInt(value) })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filter Button */}
                        <div className="flex items-end">
                            <Button type="button" onClick={handleFilterSubmit} className="w-full">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-3">
                    <Button onClick={handleExport} variant="outline" className="bg-green-600 text-white hover:bg-green-700">
                        <Download className="mr-2 h-4 w-4" />
                        Download Logs Excel
                    </Button>
                    <Button onClick={handleExportFull} variant="outline" className="bg-red-600 text-white hover:bg-red-700">
                        <Download className="mr-2 h-4 w-4" />
                        Download Full Logs
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Sr. No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Operation
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                            {logs.data.length > 0 ? (
                                logs.data.map((log, index) => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                            {logs.from + index}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                            {log.causer?.name || 'System'}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-900 dark:text-gray-100">
                                            {log.event}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                            {log.subject_type.split('\\').pop()}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No logs found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Showing {logs.from} to {logs.to} of {logs.total} results
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(logs.prev_page_url)}
                            disabled={!logs.prev_page_url}
                        >
                            Previous
                        </Button>
                        
                        {logs.links.slice(1, -1).map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePageChange(link.url)}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(logs.next_page_url)}
                            disabled={!logs.next_page_url}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}