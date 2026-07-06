"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, ServerCog } from "lucide-react";
import { toast } from "sonner";

export function BackupRestoreSettings() {
  
  const handleExport = (format: string) => {
    toast.success(`Exporting database to ${format}...`);
    // Future integration: Trigger Supabase function to dump DB
  };

  const handleImport = () => {
    toast.info("Database import feature is coming soon.");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">Backup & Restore</h2>
        <p className="text-sm text-muted-foreground">Keep your data safe by exporting backups.</p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Download className="w-5 h-5 text-primary"/> Export Data</CardTitle>
            <CardDescription>Export your entire database records securely.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="w-full justify-start" onClick={() => handleExport('CSV')}>
                Export as CSV
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleExport('Excel')}>
                Export as Excel
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleExport('JSON')}>
                Export as JSON
              </Button>
            </div>
            <Button className="w-full max-w-sm mt-4">Download Complete Backup</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Upload className="w-5 h-5 text-destructive"/> Restore Data</CardTitle>
            <CardDescription>Import a previously saved backup to restore your system. This will overwrite current data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleImport}>Restore from Backup</Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ServerCog className="w-5 h-5 text-indigo-500"/> Cloud Backups</CardTitle>
            <CardDescription>
              Future Architecture: Automated daily cloud backups to AWS S3 / Supabase Storage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" disabled>Configure Cloud Backup (Coming Soon)</Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
