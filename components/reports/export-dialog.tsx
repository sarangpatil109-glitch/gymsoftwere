"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileText, FileSpreadsheet, FileIcon, Printer } from "lucide-react";
import { exportService, ExportFormat } from "@/services/exportService";
import { useGymProfile } from "@/hooks/useSettings";
import { toast } from "sonner";

interface ExportDialogProps {
  title: string;
  filename: string;
  data: Record<string, unknown>[];
  columns: { header: string; dataKey: string }[];
}

export function ExportDialog({ title, filename, data, columns }: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: gymProfile } = useGymProfile();

  const handleExport = (format: ExportFormat) => {
    try {
      exportService.exportData(format, {
        filename,
        title,
        data,
        columns,
        gymProfile: gymProfile || undefined
      });
      if (format !== 'print') {
        toast.success(`Exported as ${format.toUpperCase()} successfully`);
      }
      setOpen(false);
    } catch (error: unknown) {
      toast.error(`Export failed: ${(error as Error).message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="gap-2" />}>
        <Download className="h-4 w-4" />
        Export
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>
            Choose a format to download the {title.toLowerCase()} report.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button 
            variant="outline" 
            className="h-24 flex-col gap-2"
            onClick={() => handleExport('pdf')}
            disabled={!data || data.length === 0}
          >
            <FileIcon className="h-8 w-8 text-rose-500" />
            PDF Document
          </Button>
          
          <Button 
            variant="outline" 
            className="h-24 flex-col gap-2"
            onClick={() => handleExport('xlsx')}
            disabled={!data || data.length === 0}
          >
            <FileSpreadsheet className="h-8 w-8 text-emerald-500" />
            Excel Worksheet
          </Button>

          <Button 
            variant="outline" 
            className="h-24 flex-col gap-2"
            onClick={() => handleExport('csv')}
            disabled={!data || data.length === 0}
          >
            <FileText className="h-8 w-8 text-blue-500" />
            CSV File
          </Button>

          <Button 
            variant="outline" 
            className="h-24 flex-col gap-2"
            onClick={() => handleExport('print')}
            disabled={!data || data.length === 0}
          >
            <Printer className="h-8 w-8 text-slate-500" />
            Print Report
          </Button>
        </div>
        
        {!data || data.length === 0 && (
          <p className="text-sm text-amber-500 text-center">No data available to export.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
