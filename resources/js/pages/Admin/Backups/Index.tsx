import { Head, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Upload, Download, Trash2, RotateCcw, AlertCircle } from "lucide-react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { useState } from "react";

interface BackupFile {
  filename: string;
  size: string;
  created_at: string;
}

interface BackupProps {
  backups: BackupFile[];
}

export default function AdminBackupPage({ backups }: BackupProps) {
  const { flash } = usePage().props as any;
  const [processing, setProcessing] = useState(false);
  const [processingFile, setProcessingFile] = useState<string | null>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Backups', href: '#' },
  ];

  const createBackup = () => {
    if (processing) return;
    
    setProcessing(true);
    router.post('/admin/backups/create', {}, {
      preserveScroll: true,
      onFinish: () => setProcessing(false),
    });
  };

  const restoreBackup = (filename: string) => {
    if (processing) return;

    if (!confirm("⚠️ WARNING: This will replace your current database with the backup!\n\nAre you absolutely sure you want to continue?")) {
      return;
    }

    setProcessing(true);
    setProcessingFile(filename);
    
    router.post('/admin/backups/restore', { filename }, {
      preserveScroll: true,
      onFinish: () => {
        setProcessing(false);
        setProcessingFile(null);
      },
    });
  };

  const downloadBackup = (filename: string) => {
    window.location.href = `/admin/backups/download/${filename}`;
  };

  const deleteBackup = (filename: string) => {
    if (processing) return;

    if (!confirm(`Are you sure you want to delete this backup?\n\n${filename}`)) {
      return;
    }

    setProcessing(true);
    setProcessingFile(filename);

    router.delete(`/admin/backups/${filename}`, {
      preserveScroll: true,
      onFinish: () => {
        setProcessing(false);
        setProcessingFile(null);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Backups - Admin" />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700 rounded-lg mb-6">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Backups</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage database backups and restore</p>
            </div>
            <Button
              variant="default"
              onClick={createBackup}
              disabled={processing}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              <Database className="w-4 h-4" />
              <span>{processing ? 'Creating...' : 'Create Backup'}</span>
            </Button>
          </div>
        </div>

        {/* Flash Messages */}
        {flash?.success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center space-x-2">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-green-800 dark:text-green-300">{flash.success}</p>
          </div>
        )}

        {flash?.error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm font-medium text-red-800 dark:text-red-300">{flash.error}</p>
          </div>
        )}

        {/* Warning Box */}
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-300">
              <p className="font-semibold mb-1">Important Notes:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Creating backups may take a few moments depending on database size</li>
                <li>Restoring a backup will <strong>completely replace</strong> your current database</li>
                <li>Download important backups to keep them safe</li>
                <li>Make sure <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">mysqldump</code> and <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">mysql</code> commands are available on your server</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Backup List */}
        <div className="space-y-4">
          {backups.length === 0 ? (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="py-12">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Upload className="mx-auto h-12 w-12 mb-4 text-gray-400 dark:text-gray-500" />
                  <h3 className="text-lg font-medium mb-2 dark:text-white">No backups yet</h3>
                  <p className="mb-4">Create your first backup to secure your system data.</p>
                  <Button
                    variant="outline"
                    onClick={createBackup}
                    disabled={processing}
                    className="mx-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Create First Backup
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            backups.map((backup) => (
              <Card key={backup.filename} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-gray-900/50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center space-x-2 dark:text-white">
                        <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-mono">{backup.filename}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {backup.created_at}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          {backup.size}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Download */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadBackup(backup.filename)}
                        disabled={processing}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30 dark:border-gray-600"
                        title="Download Backup"
                      >
                        <Download className="w-4 h-4" />
                      </Button>

                      {/* Restore */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => restoreBackup(backup.filename)}
                        disabled={processing}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30 dark:border-gray-600"
                        title="Restore Backup"
                      >
                        <RotateCcw className={`w-4 h-4 ${processingFile === backup.filename && processing ? 'animate-spin' : ''}`} />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteBackup(backup.filename)}
                        disabled={processing}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30 dark:border-gray-600"
                        title="Delete Backup"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>

        {/* Stats Footer */}
        {backups.length > 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Total Backups: <strong className="dark:text-white">{backups.length}</strong></span>
              <span>Latest: <strong className="dark:text-white">{backups[0]?.created_at}</strong></span>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}