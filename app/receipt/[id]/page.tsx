"use client";

import { usePaymentById } from "@/hooks/usePayments";
import { format } from "date-fns";
import { Loader2, Printer, ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useReceiptSettings, useGymProfile } from "@/hooks/useSettings";

export default function ReceiptPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: payment, isLoading: isLoadingPayment, error } = usePaymentById(id as string);
  const { data: receiptSettings, isLoading: isLoadingSettings } = useReceiptSettings();
  const { data: profile } = useGymProfile();

  useEffect(() => {
    // We could auto-print but better to let user click the button to prevent popup blockers
  }, []);

  if (isLoadingPayment || isLoadingSettings) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
        <p className="text-xl font-semibold text-rose-500">Receipt Not Found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8 flex flex-col items-center">
      {/* Non-printable controls */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6 print:hidden">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" /> Print / Save as PDF
        </Button>
      </div>

      {/* Printable Area */}
      <div className="bg-white text-black w-full max-w-2xl p-8 md:p-12 shadow-sm border rounded-sm print:shadow-none print:border-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{profile?.gymName || "GymOS"}</h1>
            <p className="text-gray-500 mt-1">{profile?.address || "Fitness Center"}</p>
            {profile?.mobile && <p className="text-gray-500 text-sm">Ph: {profile.mobile}</p>}
            {profile?.gstNumber && <p className="text-gray-500 text-sm mt-1">GSTIN: {profile.gstNumber}</p>}
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-semibold text-gray-800 uppercase tracking-wider">RECEIPT</h2>
            <p className="font-medium text-gray-600 mt-1">{payment.receiptNumber}</p>
            <p className="text-sm text-gray-500">{format(new Date(payment.paymentDate), "MMM dd, yyyy")}</p>
          </div>
        </div>

        {receiptSettings?.receiptHeader && (
          <div className="text-center py-4 border-b mb-6">
            <p className="text-lg font-medium text-gray-800">{receiptSettings.receiptHeader}</p>
          </div>
        )}

        {/* Member Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
            <p className="font-semibold text-lg">{payment.member.fullName}</p>
            <p className="text-sm text-gray-600">ID: {payment.member.memberId}</p>
            <p className="text-sm text-gray-600">{payment.member.mobileNumber}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment Details</p>
            <p className="text-sm"><span className="text-gray-500 w-24 inline-block">Method:</span> <span className="font-medium">{payment.paymentMethod}</span></p>
            {payment.transactionReference && (
              <p className="text-sm"><span className="text-gray-500 w-24 inline-block">Ref:</span> <span className="font-medium">{payment.transactionReference}</span></p>
            )}
            <p className="text-sm"><span className="text-gray-500 w-24 inline-block">Status:</span> 
              <Badge variant="outline" className="ml-1 text-xs">{payment.status}</Badge>
            </p>
          </div>
        </div>

        {/* Line Items */}
        <div className="border rounded-md overflow-hidden mb-8">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Description</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Duration</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-4">
                  <p className="font-medium">{payment.membership.membershipType} Membership</p>
                </td>
                <td className="px-4 py-4 text-gray-600">
                  {format(new Date(payment.membership.startDate), "MMM dd, yyyy")} - {format(new Date(payment.membership.expiryDate), "MMM dd, yyyy")}
                </td>
                <td className="px-4 py-4 text-right font-medium text-gray-900">
                  ₹{payment.membership.finalAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end border-b pb-6 mb-8">
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Billed</span>
              <span className="font-medium text-gray-900">₹{payment.membership.finalAmount}</span>
            </div>
            {payment.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Discount</span>
                <span className="font-medium text-emerald-600">- ₹{payment.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-800">Amount Paid</span>
              <span className="text-primary">₹{payment.amountPaid}</span>
            </div>
            {payment.balanceAmount > 0 && (
              <div className="flex justify-between text-sm pt-2 border-t mt-2">
                <span className="text-rose-500 font-medium">Pending Balance</span>
                <span className="font-bold text-rose-600">₹{payment.balanceAmount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-8 mt-12 grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-500 mb-8">{receiptSettings?.authorizedSignatureText || "Authorized Signature"}</p>
            <div className="w-48 border-b border-gray-400"></div>
          </div>
          <div className="text-right">
            {receiptSettings?.receiptFooter && (
              <p className="text-sm text-gray-500 whitespace-pre-wrap">{receiptSettings.receiptFooter}</p>
            )}
            {!receiptSettings?.receiptFooter && (
              <p className="text-sm text-gray-500">
                Thank you for your business!<br />
                This is a computer generated receipt.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
