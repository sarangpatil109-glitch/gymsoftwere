import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { GymProfile } from '@/types/settings';

// Extending jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: unknown) => jsPDF;
}

export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'print';

export interface ExportOptions {
  filename: string;
  title: string;
  data: Record<string, unknown>[];
  columns: { header: string; dataKey: string }[];
  gymProfile?: GymProfile;
}

export const exportService = {
  
  exportData(format: ExportFormat, options: ExportOptions) {
    switch (format) {
      case 'csv':
        this.exportCSV(options);
        break;
      case 'xlsx':
        this.exportExcel(options);
        break;
      case 'pdf':
        this.exportPDF(options);
        break;
      case 'print':
        this.printReport(options);
        break;
    }
  },

  exportCSV({ filename, data, columns }: ExportOptions) {
    if (!data || data.length === 0) return;

    // Create CSV header
    const header = columns.map(c => `"${c.header}"`).join(',');
    
    // Create rows
    const rows = data.map(row => {
      return columns.map(c => {
        const val = row[c.dataKey];
        const stringVal = val !== null && val !== undefined ? String(val) : '';
        // Escape quotes
        return `"${stringVal.replace(/"/g, '""')}"`;
      }).join(',');
    });

    const csvContent = [header, ...rows].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportExcel({ filename, data, columns }: ExportOptions) {
    if (!data || data.length === 0) return;

    // Map data to match column headers
    const formattedData = data.map(row => {
      const newRow: Record<string, unknown> = {};
      columns.forEach(col => {
        newRow[col.header] = row[col.dataKey];
      });
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  },

  exportPDF({ filename, title, data, columns, gymProfile }: ExportOptions) {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    const gymName = gymProfile?.gymName || 'GymOS';
    const timestamp = format(new Date(), 'dd MMM yyyy, hh:mm a');

    // Add Header
    doc.setFontSize(20);
    doc.text(gymName, 14, 22);
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(title, 14, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated on: ${timestamp}`, 14, 36);

    // Map data
    const body = data.map(row => columns.map(c => row[c.dataKey] !== undefined && row[c.dataKey] !== null ? String(row[c.dataKey]) : ''));

    // Table
    doc.autoTable({
      head: [columns.map(c => c.header)],
      body: body,
      startY: 42,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }, // Blue-500
    });

    // Add Footer
    const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    doc.save(`${filename}.pdf`);
  },

  printReport(options: ExportOptions) {
    // Generate PDF blob and open in new tab for printing
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    const gymName = options.gymProfile?.gymName || 'GymOS';
    const timestamp = format(new Date(), 'dd MMM yyyy, hh:mm a');

    doc.setFontSize(20);
    doc.text(gymName, 14, 22);
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(options.title, 14, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated on: ${timestamp}`, 14, 36);

    const body = options.data.map(row => options.columns.map(c => row[c.dataKey] !== undefined && row[c.dataKey] !== null ? String(row[c.dataKey]) : ''));

    doc.autoTable({
      head: [options.columns.map(c => c.header)],
      body: body,
      startY: 42,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
  }
};
