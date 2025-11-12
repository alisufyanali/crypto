import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

interface Permission {
    id: number;
    name: string;
    description?: string;
    guard_name?: string;
    created_at?: string;
    updated_at?: string;
}

export default function CreateRole() {
    const { props }: any = usePage();
    const { permissions, flash } = props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        permissions: [] as number[],
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);

    // Convert grouped permissions to flat array OR use direct array
    useEffect(() => {
        if (permissions) {
            // Check if permissions is already an array
            if (Array.isArray(permissions)) {
                setAllPermissions(permissions);
                
                const grouped = permissions.reduce((acc, permission) => {
                    const category = permission.name.split('.')[0] || 'General';
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(permission);
                    return acc;
                }, {} as Record<string, Permission[]>);
                setGroupedPermissions(grouped);
            } 
            // If permissions is an object with categories (like {user: [...], roles: [...]})
            else if (typeof permissions === 'object' && !Array.isArray(permissions)) {
                // Convert grouped object to flat array
                const flatPermissions: Permission[] = [];
                Object.values(permissions).forEach((categoryPermissions: any) => {
                    if (Array.isArray(categoryPermissions)) {
                        flatPermissions.push(...categoryPermissions);
                    }
                });
                setAllPermissions(flatPermissions);
                
                // Use the original grouped structure
                setGroupedPermissions(permissions);
            }
        }
    }, [permissions]);

    // Filter permissions based on search
    const filteredPermissions = Object.keys(groupedPermissions).reduce((acc, category) => {
        const categoryPermissions = groupedPermissions[category];
        if (Array.isArray(categoryPermissions)) {
            const filtered = categoryPermissions.filter(permission =>
                permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                permission.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (filtered.length > 0) {
                acc[category] = filtered;
            }
        }
        return acc;
    }, {} as Record<string, Permission[]>);

    const handleCheckboxChange = (id: number) => {
        setData(
            "permissions",
            data.permissions.includes(id)
                ? data.permissions.filter((pid) => pid !== id)
                : [...data.permissions, id]
        );
    };

    const handleSelectAll = (category: string) => {
        const categoryPermissions = filteredPermissions[category]?.map(p => p.id) || [];
        const allSelected = categoryPermissions.every(id => data.permissions.includes(id));

        if (allSelected) {
            // Deselect all
            setData("permissions", data.permissions.filter(id => !categoryPermissions.includes(id)));
        } else {
            // Select all
            setData("permissions", [...new Set([...data.permissions, ...categoryPermissions])]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/roles", {
            onSuccess: () => reset(),
        });
    };

    const formatPermissionName = (name: string) => {
        return name.split('.')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const breadcrumbs = [
        { title: "Roles Management", href: "/roles" },
        { title: "Create Role", href: "/roles/create" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 rounded-xl flex items-center justify-center shadow-lg transition-colors">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                                    Create New Role
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
                                    Define a new role with specific permissions
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-3 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {flash.success}
                            </div>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {flash.error}
                            </div>
                        </div>
                    )}

                    {/* Form Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800 transition-colors">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
                                Role Details
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Role Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                    Role Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-colors duration-200 py-3 px-4 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="e.g. Manager, Analyst, Viewer"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-600 dark:text-red-400 text-sm font-medium mt-1 flex items-center gap-1 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Permissions Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                        Permissions
                                    </label>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {data.permissions.length} of {allPermissions.length} permissions selected
                                    </div>
                                </div>

                                {/* Search Box */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Search permissions by name or description..."
                                    />
                                </div>

                                {/* Permissions Grid */}
                                {Object.keys(filteredPermissions).length > 0 ? (
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                                        {Object.keys(filteredPermissions).map((category) => (
                                            <div key={category} className="bg-gray-50 dark:bg-gray-800/50">
                                                {/* Category Header */}
                                                <div className="flex items-center justify-between p-4">
                                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                                                        {category} ({filteredPermissions[category].length})
                                                    </h3>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSelectAll(category)}
                                                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                                    >
                                                        {filteredPermissions[category].every(p => data.permissions.includes(p.id))
                                                            ? 'Deselect All'
                                                            : 'Select All'
                                                        }
                                                    </button>
                                                </div>

                                                {/* Permissions List */}
                                                <div className="p-4 bg-white dark:bg-gray-800">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {filteredPermissions[category].map((permission) => (
                                                            <label
                                                                key={permission.id}
                                                                className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={data.permissions.includes(permission.id)}
                                                                    onChange={() => handleCheckboxChange(permission.id)}
                                                                    className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        {formatPermissionName(permission.name)}
                                                                    </div>
                                                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">
                                                                        {permission.name}
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No permissions found</h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {allPermissions.length === 0 ? 'No permissions available in the system.' : 'Try adjusting your search criteria.'}
                                        </p>
                                    </div>
                                )}

                                {errors.permissions && (
                                    <p className="text-red-600 dark:text-red-400 text-sm font-medium mt-1 flex items-center gap-1 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.permissions}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors">
                                <Link
                                    href="/roles"
                                    className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors duration-200 text-center"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 border border-transparent rounded-lg hover:from-purple-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Role...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Create Role
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}