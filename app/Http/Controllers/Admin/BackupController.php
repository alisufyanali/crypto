<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use ZipArchive;

class BackupController extends Controller
{
    private $backupPath;

    public function __construct()
    {
        $this->backupPath = storage_path('app/backups');
        
        // Create backup directory if it doesn't exist
        if (!File::exists($this->backupPath)) {
            File::makeDirectory($this->backupPath, 0755, true);
        }
    }

    public function index()
    {
        $files = File::files($this->backupPath);
        $backups = [];

        foreach ($files as $file) {
            if ($file->getExtension() === 'sql' || $file->getExtension() === 'zip') {
                $backups[] = [
                    'filename' => $file->getFilename(),
                    'size' => $this->formatBytes($file->getSize()),
                    'created_at' => date('Y-m-d H:i:s', $file->getMTime()),
                ];
            }
        }

        // Sort by created_at descending
        usort($backups, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        return inertia('Admin/Backups/Index', compact('backups'));
    }

    public function create()
    {
        try {
            $filename = 'backup_' . now()->format('Y-m-d_H-i-s') . '.sql';
            $filepath = $this->backupPath . '/' . $filename;

            // Get database configuration
            $dbHost = env('DB_HOST', '127.0.0.1');
            $dbPort = env('DB_PORT', '3306');
            $dbName = env('DB_DATABASE');
            $dbUser = env('DB_USERNAME');
            $dbPass = env('DB_PASSWORD');

            // Build mysqldump command
            $command = sprintf(
                'mysqldump --user=%s --password=%s --host=%s --port=%s %s > %s',
                escapeshellarg($dbUser),
                escapeshellarg($dbPass),
                escapeshellarg($dbHost),
                escapeshellarg($dbPort),
                escapeshellarg($dbName),
                escapeshellarg($filepath)
            );

            // Execute backup
            exec($command, $output, $returnVar);

            if ($returnVar !== 0 || !File::exists($filepath)) {
                throw new \Exception('Backup command failed');
            }

            // Optional: Compress the backup
            $this->compressBackup($filepath);

            return redirect()->back()->with('success', 'Backup created successfully!');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Backup failed: ' . $e->getMessage());
        }
    }

    public function restore(Request $request)
    {
        $request->validate(['filename' => 'required|string']);

        try {
            $filepath = $this->backupPath . '/' . $request->filename;

            if (!File::exists($filepath)) {
                return redirect()->back()->with('error', 'Backup file not found.');
            }

            // If it's a zip file, extract it first
            if (pathinfo($filepath, PATHINFO_EXTENSION) === 'zip') {
                $extractedPath = $this->extractBackup($filepath);
                if (!$extractedPath) {
                    return redirect()->back()->with('error', 'Failed to extract backup.');
                }
                $filepath = $extractedPath;
            }

            // Get database configuration
            $dbHost = env('DB_HOST', '127.0.0.1');
            $dbPort = env('DB_PORT', '3306');
            $dbName = env('DB_DATABASE');
            $dbUser = env('DB_USERNAME');
            $dbPass = env('DB_PASSWORD');

            // Build mysql restore command
            $command = sprintf(
                'mysql --user=%s --password=%s --host=%s --port=%s %s < %s',
                escapeshellarg($dbUser),
                escapeshellarg($dbPass),
                escapeshellarg($dbHost),
                escapeshellarg($dbPort),
                escapeshellarg($dbName),
                escapeshellarg($filepath)
            );

            // Execute restore
            exec($command, $output, $returnVar);

            if ($returnVar !== 0) {
                throw new \Exception('Restore command failed');
            }

            // Clear cache after restore
            Artisan::call('cache:clear');
            Artisan::call('config:clear');

            return redirect()->back()->with('success', 'Database restored successfully!');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Restore failed: ' . $e->getMessage());
        }
    }

    public function download($filename)
    {
        $filepath = $this->backupPath . '/' . $filename;

        if (!File::exists($filepath)) {
            return redirect()->back()->with('error', 'Backup file not found.');
        }

        return response()->download($filepath);
    }

    /**
     * Delete a backup file
     */
    public function delete($filename)
    {
        try {
            $filepath = $this->backupPath . '/' . $filename;

            if (!File::exists($filepath)) {
                return redirect()->back()->with('error', 'Backup file not found.');
            }

            File::delete($filepath);

            return redirect()->back()->with('success', 'Backup deleted successfully!');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Delete failed: ' . $e->getMessage());
        }
    }

    /**
     * Compress backup file
     */
    private function compressBackup($filepath)
    {
        $zip = new ZipArchive();
        $zipPath = str_replace('.sql', '.zip', $filepath);

        if ($zip->open($zipPath, ZipArchive::CREATE) === true) {
            $zip->addFile($filepath, basename($filepath));
            $zip->close();

            // Delete original SQL file
            File::delete($filepath);

            return $zipPath;
        }

        return false;
    }

    /**
     * Extract backup from zip
     */
    private function extractBackup($zipPath)
    {
        $zip = new ZipArchive();
        
        if ($zip->open($zipPath) === true) {
            $sqlFile = null;
            
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $filename = $zip->getNameIndex($i);
                if (pathinfo($filename, PATHINFO_EXTENSION) === 'sql') {
                    $sqlFile = $filename;
                    break;
                }
            }

            if ($sqlFile) {
                $extractPath = $this->backupPath . '/temp_' . time() . '.sql';
                copy("zip://{$zipPath}#{$sqlFile}", $extractPath);
                $zip->close();
                return $extractPath;
            }

            $zip->close();
        }

        return false;
    }

    /**
     * Format bytes to human readable
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}