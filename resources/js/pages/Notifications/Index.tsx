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
  post(route("notifications.read", { id }), {}, { preserveScroll: true });
};

const deleteNotification = (id: number) => {
  if (confirm("Are you sure?")) {
    destroy(route("notifications.destroy", { id }), { preserveScroll: true });
  }
};


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notifications" />
      <div className="container mx-auto py-6">
        <h2 className="text-2xl font-semibold mb-4">All Notifications</h2>

        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications found.</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n: Notification) => (
              <li
                key={n.id}
                className={`border rounded p-4 flex justify-between items-start ${
                  !n.is_read ? "bg-gray-100" : "bg-white"
                }`}
              >
                <div>
                  <p className="text-gray-800">{n.message}</p>
                  <small className="text-gray-500">
                    {new Date(n.created_at).toLocaleString()}
                  </small>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => markAsRead(n.id)}
                    disabled={n.is_read}
                    className={`px-3 py-1 rounded text-sm flex items-center gap-1 border ${
                      n.is_read
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-white text-blue-600 border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    {n.is_read ? "Read" : "Mark Read"}
                  </button>

                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="px-3 py-1 rounded text-sm flex items-center gap-1 border bg-white text-red-600 border-red-400 hover:bg-red-50"
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
