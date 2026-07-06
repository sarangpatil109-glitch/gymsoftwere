"use client";

import { useState } from "react";
import { Member } from "@/types/member";
import { Button } from "@/components/ui/button";
import { Globe, Copy, ExternalLink, QrCode, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

interface MemberWebsiteCellProps {
  member: Member;
}

export function MemberWebsiteCell({ member }: MemberWebsiteCellProps) {
  const [isQrOpen, setIsQrOpen] = useState(false);

  const getFullUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/member/${member.memberSlug || member.memberId}`;
    }
    return `/member/${member.memberSlug || member.memberId}`;
  };

  const getRelativeUrl = () => {
    return `/member/${member.memberSlug || member.memberId}`;
  };

  // If member.portalUrl is an absolute URL (legacy), extract the path or just use getRelativeUrl()
  // Since we are migrating to relative URLs, we'll prefer getRelativeUrl() for internal navigation
  const relativeUrl = getRelativeUrl();
  const fullUrl = getFullUrl();

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    toast.success("Portal link copied successfully.");
  };

  const downloadQR = () => {
    const canvas = document.getElementById(`qr-${member.id}`) as HTMLCanvasElement;
    if (!canvas) {
      // In SVG mode, we need to convert to canvas first or download SVG
      const svg = document.getElementById(`qr-svg-${member.id}`);
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${member.fullName.replace(/\s+/g, "_")}_Portal_QR.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      return;
    }
  };

  const printQR = () => {
    const svg = document.getElementById(`qr-svg-${member.id}`);
    if (svg) {
      const printWindow = window.open('', '', 'width=600,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print QR Code - ${member.fullName}</title>
              <style>
                body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: sans-serif; }
                h1 { margin-bottom: 20px; font-size: 24px; color: #333; }
                svg { max-width: 300px; max-height: 300px; }
              </style>
            </head>
            <body>
              <h1>${member.fullName}'s Portal</h1>
              ${svg.outerHTML}
              <script>
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 250);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 font-medium text-sm text-slate-700 dark:text-slate-200">
        <Globe className="h-4 w-4 text-blue-500" /> View Portal
      </div>
      <span className="text-xs text-muted-foreground truncate max-w-[150px] mb-2" title={fullUrl}>
        {fullUrl.replace(/^https?:\/\//, '')}
      </span>
      
      <div className="flex items-center gap-1">
        <Link 
          href={relativeUrl} 
          target="_blank" 
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={copyLink}>
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsQrOpen(true)}>
          <QrCode className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{member.fullName}'s Portal QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-6">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
              <QRCodeSVG 
                id={`qr-svg-${member.id}`}
                value={fullUrl} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-center text-slate-500">
              Scan this QR code to quickly access the member portal.
            </p>
            <div className="flex w-full gap-3">
              <Button variant="outline" className="flex-1" onClick={downloadQR}>
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={printQR}>
                <Printer className="h-4 w-4 mr-2" /> Print
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
