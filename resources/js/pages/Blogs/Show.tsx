import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface Blog {
    id: number;
    name: string;
    slug: string;
    description: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    blog: Blog;
}

export default function Show({ blog }: Props) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this blog?')) {
            router.delete(`/blogs/${blog.id}`);
        }
    };

    return (
        <>
            <Head title={blog.name} />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold">{blog.name}</h1>
                                <div className="flex space-x-2">
                                    <Link
                                        href="/blogs"
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Back to Blogs
                                    </Link>
                                    <Link
                                        href={`/blogs/${blog.id}/edit`}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                            Blog Name
                                        </h3>
                                        <p className="mt-1 text-lg text-gray-900">{blog.name}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                            Slug
                                        </h3>
                                        <p className="mt-1 text-lg text-gray-900 font-mono bg-gray-200 px-2 py-1 rounded inline-block">
                                            {blog.slug}
                                        </p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                            Description
                                        </h3>
                                        <p className="mt-1 text-gray-900 whitespace-pre-line">{blog.description}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                            Created At
                                        </h3>
                                        <p className="mt-1 text-gray-900">
                                            {new Date(blog.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                            Last Updated
                                        </h3>
                                        <p className="mt-1 text-gray-900">
                                            {new Date(blog.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}