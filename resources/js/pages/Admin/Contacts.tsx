import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, Mail, Phone, Building } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  company_name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
  formatted_date: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface AdminContactsProps {
  contacts: {
    data: Contact[];
    links: PaginationLink[];
    meta: PaginationMeta;
  };
  status?: string;
}

export default function AdminContacts({ contacts, status }: AdminContactsProps) {
  const markAsRead = (id: number) => {
    router.patch(
      `/admin/contacts/${id}/read`,
      {},
      {
        preserveScroll: true,
      }
    );
  };

  const deleteContact = (id: number) => {
    if (confirm("Are you sure you want to delete this contact message?")) {
      router.delete(`/admin/contacts/${id}`, {
        preserveScroll: true,
      });
    }
  };

  const unreadCount = contacts.data.filter((c) => !c.is_read).length;

  return (
    <>
      <Head title="Contact Messages - Admin" />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Contact Messages
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage customer inquiries and messages
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {unreadCount > 0 && (
                  <Badge variant="destructive">{unreadCount} Unread</Badge>
                )}
                <Badge variant="outline">Total: {contacts.meta.total}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Message */}
          {status && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm font-medium text-green-600">
              {status}
            </div>
          )}

          {/* Contact Messages */}
          <div className="space-y-6">
            {contacts.data.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <Mail className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No contact messages yet
                    </h3>
                    <p>
                      When customers submit the contact form, their messages
                      will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              contacts.data.map((contact) => (
                <Card
                  key={contact.id}
                  className={`${
                    !contact.is_read
                      ? "ring-2 ring-blue-500 ring-opacity-50"
                      : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">
                            {contact.name}
                          </CardTitle>
                          {!contact.is_read && (
                            <Badge variant="destructive" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{contact.company_name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{contact.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{contact.phone}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {contact.formatted_date}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!contact.is_read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(contact.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Mark Read
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteContact(contact.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Message:
                      </h4>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {contact.message}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          {contacts.meta.total > contacts.meta.per_page && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                {contacts.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => link.url && router.get(link.url)}
                    disabled={!link.url}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      link.active
                        ? "bg-blue-600 text-white"
                        : link.url
                        ? "bg-white text-gray-700 hover:bg-gray-50 border"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
