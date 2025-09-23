import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function Unauthorized() {
  return (
    <>
      <Head title="Unauthorized" />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
        <h1 className="text-7xl font-bold text-red-600">403</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Unauthorized Access
        </h2>
        <p className="mt-2 text-gray-600">
          Sorry, you don’t have permission to view this page.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Go Home
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
          >
            Login Again
          </Link>
        </div>
      </div>
    </>
  );
}
