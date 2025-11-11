// resources/js/Pages/Permissions/Index.tsx
import { Head, Link, router } from '@inertiajs/react';
import { Trash2, Edit, Plus } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
}

interface Props {
    permissions: Record<string, Permission[]>;
}

export default function PermissionsIndex({ permissions }: Props) {
    const deletePermission = (id: number) => {
        if (confirm('Are you sure you want to delete this permission?')) {
            router.delete(`/permissions/${id}`);
        }
    };

    return (
        <>
            <Head title="Permissions Management" />
            
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Permissions Management
                    </h1>
                    <Link
                        href="/permissions/create"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Create Permission
                    </Link>
                </div>

                <div className="space-y-4">
                    {Object.entries(permissions).map(([group, groupPermissions]) => (
                        <div
                            key={group}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                        >
                            <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                    {group} Permissions
                                </h2>
                            </div>
                            
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Permission Name
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {groupPermissions.map((permission) => (
                                        <tr key={permission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {permission.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/permissions/${permission.id}/edit`}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => deletePermission(permission.id)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
 