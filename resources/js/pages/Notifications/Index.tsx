import { Head, useForm, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Trash2, CheckCircle2 } from "lucide-react";
import { route, Config } from "ziggy-js";
import { Ziggy } from "@/ziggy";
import { type BreadcrumbItem } from '@/types';

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Notifications',
    href: '/notifications',
  }
];

export default function NotificationsIndex({ notifications, flash }: any) {
  const { post, delete: destroy } = useForm({});
  
  const markAsRead = (id: number) => {
    post(route("notifications.read", { id }), {
      preserveScroll: true,
      preserveState: true
    });
  };

  const deleteNotification = (id: number) => {
    if (confirm("Are you sure?")) {
      destroy(route("notifications.destroy", { id }), {
        preserveScroll: true,
        preserveState: true
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notifications" />
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white transition-colors">
          All Notifications
        </h2>

        {notifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 transition-colors">
            No notifications found.
          </p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n: Notification) => (
              <li
                key={n.id}
                className={`border rounded-lg p-4 flex justify-between items-start transition-all duration-200 ${
                  !n.is_read 
                    ? "bg-gray-100 dark:bg-blue-900/20 border-gray-300 dark:border-blue-700 ring-2 ring-blue-500/20 dark:ring-blue-400/20" 
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex-1">
                  <p className={`font-medium ${
                    !n.is_read 
                      ? "text-gray-900 dark:text-white" 
                      : "text-gray-700 dark:text-gray-300"
                  } transition-colors`}>
                    {n.message}
                  </p>
                  <small className="text-gray-500 dark:text-gray-400 transition-colors">
                    {new Date(n.created_at).toLocaleString()}
                  </small>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => markAsRead(n.id)}
                    disabled={n.is_read}
                    className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 border transition-all duration-200 ${
                      n.is_read
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700 cursor-default"
                        : "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-blue-400 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500 dark:hover:border-blue-500"
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    {n.is_read ? "Read" : "Mark Read"}
                  </button>

                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="px-3 py-2 rounded-lg text-sm flex items-center gap-1 border transition-all duration-200 bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 border-red-400 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-500 dark:hover:border-red-500"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}