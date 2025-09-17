import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function Create() {
  const [data, setData] = useState({
    name: '',
    slug: '',
    description: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    router.post('/blogs', data, {
      onError: (errors) => {
        setErrors(errors);
        setProcessing(false);
      },
      onSuccess: () => {
        setProcessing(false);
      },
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setData({
      ...data,
      name,
      slug: generateSlug(name),
    });
  };

  return (
    <>
      <Head title="Create Blog" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Create New Blog</h1>
                <Link
                  href="/blogs"
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Back to Blogs
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="max-w-lg">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={handleNameChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter blog name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    id="slug"
                    value={data.slug}
                    onChange={(e) => setData({ ...data, slug: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="blog-slug"
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-xs italic mt-1">{errors.slug}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    rows={4}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter blog description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs italic mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                  >
                    {processing ? 'Creating...' : 'Create Blog'}
                  </button>
                  <Link
                    href="/blogs"
                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}