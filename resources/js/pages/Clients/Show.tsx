import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type KycDocument = {
  id: number;
  document_type: "national_id" | "passport" | "utility_bill" | "bank_statement";
  file_path: string;
  original_filename: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string | null;
  reviewed_by?: number | null;
  reviewed_at?: string | null;
};

type Client = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  is_active: number;
  kyc_status: string;
  created_at: string;
  kyc_documents: KycDocument[];
};

interface Props {
  client: Client;
}

export default function ClientShow({ client }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Clients", href: "/clients" },
    { title: client.name, href: `/clients/${client.id}` },
  ];

  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [reason, setReason] = useState("");

  // ✅ Approve / Reject / Reset handlers
  const handleApprove = (id: number) => {
    router.post(`/kyc/${id}/approve`);
  };

  const handleReject = (id: number) => {
    router.post(`/kyc/${id}/reject`, { reason });
    setRejectingId(null);
    setReason("");
  };

  const handleReset = (id: number) => {
    router.post(`/kyc/${id}/reset`);
  };

  // ✅ Toggle user status
  const toggleStatus = () => {
    router.post(`/clients/${client.id}/toggle-status`);
  };

  // ✅ Update KYC status
  const updateKycStatus = (status: "pending" | "approved" | "rejected") => {
    router.post(`/clients/${client.id}/update-kyc`, { kyc_status: status });
  };

  // ✅ Get status badge color
  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; label: string } } = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-red-100 text-red-800", label: "Inactive" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
    };

    const statusInfo = statusMap[status] || { color: "bg-gray-100 text-gray-800", label: status };
    return (
      <Badge className={`${statusInfo.color} capitalize`}>
        {statusInfo.label}
      </Badge>
    );
  };

  // ✅ Get document type icon
  const getDocumentIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      national_id: "🆔",
      passport: "📘",
      utility_bill: "📄",
      bank_statement: "💳",
    };
    return icons[type] || "📎";
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={client.name} />

      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-gray-600">{client.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/clients">
                ← Back to Clients
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Account Status</p>
                  <div className="mt-2">
                    {getStatusBadge(client.is_active == 1 ? "active" : "inactive")}
                  </div>
                </div>
                <div className="text-3xl">
                  {client.is_active == 1 ? "✅" : "❌"}
                </div>
              </div>
              <Button
                onClick={toggleStatus}
                variant={client.is_active == 1 ? "destructive" : "default"}
                size="sm"
                className="w-full mt-4"
              >
                {client.is_active == 1 ? "Deactivate Client" : "Activate Client"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">KYC Status</p>
                  <div className="mt-2">
                    {getStatusBadge(client.kyc_status)}
                  </div>
                </div>
                <div className="text-3xl">
                  {client.kyc_status === "approved" ? "✅" : 
                   client.kyc_status === "rejected" ? "❌" : "⏳"}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => updateKycStatus("approved")}
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => updateKycStatus("rejected")}
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => updateKycStatus("pending")}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Member Since</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {new Date(client.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-3xl">📅</div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {Math.floor((new Date().getTime() - new Date(client.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Client Details */}
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">👤</span>
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email Address</label>
                  <p className="text-gray-900 font-medium">{client.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone Number</label>
                  <p className="text-gray-900 font-medium">{client.phone || "Not provided"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Client ID</label>
                  <p className="text-gray-900 font-mono font-medium">#{client.id.toString().padStart(6, '0')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">KYC Documents</label>
                  <p className="text-gray-900 font-medium">{client.kyc_documents.length} documents uploaded</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Documents Section */}
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">📄</span>
              KYC Documents ({client.kyc_documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {client.kyc_documents.length > 0 ? (
              <div className="space-y-4">
                {client.kyc_documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {getDocumentIcon(doc.document_type)}
                        </div>
                        <div>
                          <h4 className="font-medium capitalize">
                            {doc.document_type.replace(/_/g, ' ')}
                          </h4>
                          <p className="text-sm text-gray-600">{doc.original_filename}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="mb-2">{getStatusBadge(doc.status)}</div>
                        <p className="text-xs text-gray-500">
                          {doc.reviewed_at ? `Reviewed: ${new Date(doc.reviewed_at).toLocaleDateString()}` : 'Not reviewed'}
                        </p>
                      </div>
                    </div>

                    {doc.rejection_reason && (
                      <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                        <p className="text-sm text-red-700 font-medium">Rejection Reason:</p>
                        <p className="text-sm text-red-600">{doc.rejection_reason}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={`/storage/${doc.file_path}`} target="_blank" rel="noopener noreferrer">
                          👁️ View Document
                        </a>
                      </Button>

                      {doc.status === "pending" && (
                        <>
                          <Button
                            onClick={() => handleApprove(doc.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            ✅ Approve
                          </Button>
                          {rejectingId === doc.id ? (
                            <div className="flex gap-2 items-center">
                              <Input
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Rejection reason..."
                                className="w-48"
                              />
                              <Button
                                onClick={() => handleReject(doc.id)}
                                size="sm"
                                variant="destructive"
                              >
                                Confirm
                              </Button>
                              <Button
                                onClick={() => setRejectingId(null)}
                                size="sm"
                                variant="outline"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => setRejectingId(doc.id)}
                              size="sm"
                              variant="destructive"
                            >
                              ❌ Reject
                            </Button>
                          )}
                        </>
                      )}

                      {doc.status !== "pending" && (
                        <Button
                          onClick={() => handleReset(doc.id)}
                          size="sm"
                          variant="outline"
                        >
                          🔄 Reset to Pending
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No KYC Documents</h3>
                <p className="text-gray-600">This client hasn't uploaded any KYC documents yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}