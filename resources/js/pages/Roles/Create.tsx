// resources/js/Pages/Roles/Create.tsx & Edit.tsx
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
}

interface Props {
    role?: Role;
    permissions: Record<string, Permission[]>;
    rolePermissions?: string[];
}

export default function RoleForm({ role, permissions, rolePermissions = [] }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name || '',
        permissions: rolePermissions || [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (role) {
            put(`/roles/${role.id}`);
        } else {
            post('/roles');
        }
    };

    const togglePermission = (permissionName: string) => {
        if (data.permissions.includes(permissionName)) {
            setData('permissions', data.permissions.filter(p => p !== permissionName));
        } else {
            setData('permissions', [...data.permissions, permissionName]);
        }
    };

    const toggleGroup = (groupPermissions: Permission[]) => {
        const groupNames = groupPermissions.map(p => p.name);
        const allSelected = groupNames.every(name => data.permissions.includes(name));
        
        if (allSelected) {
            setData('permissions', data.permissions.filter(p => !groupNames.includes(p)));
        } else {
            const newPermissions = [...data.permissions];
            groupNames.forEach(name => {
                if (!newPermissions.includes(name)) {
                    newPermissions.push(name);
                }
            });
            setData('permissions', newPermissions);
        }
    };

    return (
        <>
            <Head title={role ? 'Edit Role' : 'Create Role'} />
            
            <div className="p-6">
                <div className="mb-6">
                    <Link
                        href="/roles"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Roles
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        {role ? 'Edit Role' : 'Create New Role'}
                    </h1>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Role Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Role Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter role name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                            )}
                        </div>

                        {/* Permissions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                Permissions
                            </label>
                            
                            <div className="space-y-4">
                                {Object.entries(permissions).map(([group, groupPermissions]) => {
                                    const allSelected = groupPermissions.every(p => 
                                        data.permissions.includes(p.name)
                                    );
                                    
                                    return (
                                        <div
                                            key={group}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                                                    {group}
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleGroup(groupPermissions)}
                                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    {allSelected ? 'Deselect All' : 'Select All'}
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {groupPermissions.map((permission) => (
                                                    <label
                                                        key={permission.id}
                                                        className="flex items-center space-x-2 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={data.permissions.includes(permission.name)}
                                                            onChange={() => togglePermission(permission.name)}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                            {permission.name.split('.')[1]}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-3">
                            <Link
                                href="/roles"
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}