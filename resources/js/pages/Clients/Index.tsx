import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { Pencil, Eye, CheckCircle, XCircle, Clock, UserPlus } from "lucide-react";
import DataTableWrapper from "@/components/DataTableWrapper";
import DeleteConfirm from "@/components/DeleteConfirm";
import { useState, useEffect } from "react";

// Simple type definition without complex constraints
interface ClientPageProps {
  flash?: {
    success?: string;
    error?: string;
  };
  kyc_status?: string;
}

export default function ClientList() {
  const { props }: any = usePage(); // Use any to avoid TypeScript issues
  const { flash, kyc_status: initialKycStatus } = props;

  const [currentKycStatus, setCurrentKycStatus] = useState(initialKycStatus || '');

  // URL parameters change hone par update karein
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const kycStatusParam = urlParams.get('kyc_status');
    setCurrentKycStatus(kycStatusParam || '');
  }, []);

  const getKycStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      pending: { 
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300", 
        icon: Clock 
      },
      approved: { 
        color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300", 
        icon: CheckCircle 
      },
      rejected: { 
        color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300", 
        icon: XCircle 
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getActiveStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
          <CheckCircle size={12} className="mr-1" />
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
          <XCircle size={12} className="mr-1" />
          Inactive
        </span>
      );
    }
  };

  const columns = [
    { 
      name: "ID", 
      selector: (row: any) => row.id, 
      sortable: true, 
      width: "10%" 
    },
    { 
      name: "Name", 
      selector: (row: any) => row.name, 
      sortable: true, 
      width: "20%",
      cell: (row: any) => (
        <div className="font-medium text-gray-900 dark:text-white">{row.name}</div>
      )
    },
    { 
      name: "Email", 
      selector: (row: any) => row.email, 
      sortable: true, 
      width: "25%",
      cell: (row: any) => (
        <div className="text-gray-600 dark:text-gray-300">{row.email}</div>
      )
    },
    { 
      name: "KYC Status", 
      selector: (row: any) => row.kyc_status, 
      sortable: true, 
      width: "15%",
      cell: (row: any) => getKycStatusBadge(row.kyc_status)
    },
    { 
      name: "Active Status", 
      selector: (row: any) => row.is_active, 
      sortable: true, 
      width: "15%",
      cell: (row: any) => getActiveStatusBadge(row.is_active)
    },
    {
      name: "Actions",
      cell: (row: any, reloadData: () => void) => (
        <div className="flex gap-2">
          {/* View */}
          <Link
            href={`/clients/${row.id}`}
            className="p-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
            title="View Client"
          >
            <Eye size={16} />
          </Link>

          {/* Edit */}
          <Link
            href={`/clients/${row.id}/edit`}
            className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            title="Edit Client"
          >
            <Pencil size={16} />
          </Link>

          {/* Delete */}
          <DeleteConfirm 
            id={row.id} 
            url={`/clients/${row.id}`} 
            onSuccess={reloadData}
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "15%"
    },
  ];

  const csvHeaders = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "KYC Status", key: "kyc_status" },
    { label: "Active Status", key: "is_active" },
  ];

  // Additional filters for KYC status
  const additionalFilters = [
    {
      name: 'kyc_status',
      label: 'KYC Status',
      type: 'select' as const,
      options: [
        { value: '', label: 'All KYC Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
      ],
      defaultValue: currentKycStatus
    }
  ];

  const breadcrumbs: BreadcrumbItem[] = [{ title: "Client List", href: "/clients" }];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Clients" />

      {/* Flash Messages */}
      {flash?.success && (
        <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-3 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} />
            {flash.success}
          </div>
        </div>
      )}
      
      {flash?.error && (
        <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2">
            <XCircle size={16} />
            {flash.error}
          </div>
        </div>
      )}

      {/* KYC Status Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            onClick={() => router.get('/clients')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              !currentKycStatus 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            All Clients
          </button>
          <button
            onClick={() => router.get('/clients?kyc_status=pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentKycStatus === 'pending' 
                ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Pending KYC
          </button>
          <button
            onClick={() => router.get('/clients?kyc_status=approved')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentKycStatus === 'approved' 
                ? 'border-green-500 text-green-600 dark:text-green-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Approved KYC
          </button>
          <button
            onClick={() => router.get('/clients?kyc_status=rejected')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentKycStatus === 'rejected' 
                ? 'border-red-500 text-red-600 dark:text-red-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Rejected KYC
          </button>
        </div>
      </div>

      <DataTableWrapper
        fetchUrl={`/clients/data${currentKycStatus ? `?kyc_status=${currentKycStatus}` : ''}`}
        columns={columns}
        csvHeaders={csvHeaders}
        createUrl="/clients/create"
        createLabel="+ Create Client" // Simple string instead of JSX
        additionalFilters={additionalFilters}
      />
    </AppLayout>
  );
} 