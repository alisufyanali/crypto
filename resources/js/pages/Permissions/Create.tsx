import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
}

interface PermissionFormProps {
    permission?: Permission;
}

export function PermissionForm({ permission }: PermissionFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: permission?.name || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (permission) {
            put(`/permissions/${permission.id}`);
        } else {
            post('/permissions');
        }
    };

    return (
        <>
            <Head title={permission ? 'Edit Permission' : 'Create Permission'} />
            
            <div className="p-6">
                <div className="mb-6">
                    <Link
                        href="/permissions"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Permissions
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-2xl">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        {permission ? 'Edit Permission' : 'Create New Permission'}
                    </h1>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Permission Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., users.create"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Use format: resource.action (e.g., users.create, orders.view)
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link
                                href="/permissions"
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Saving...' : permission ? 'Update Permission' : 'Create Permission'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}