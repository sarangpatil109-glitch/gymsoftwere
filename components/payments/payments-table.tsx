import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentWithDetails } from "@/types/payment";
import { format } from "date-fns";
import { Printer } from "lucide-react";
import Link from "next/link";

interface PaymentsTableProps {
  payments: PaymentWithDetails[];
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  return (
    <div className="rounded-md border bg-card w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Receipt No</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Member</TableHead>
            <TableHead>Membership</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.receiptNumber}</TableCell>
              <TableCell>{format(new Date(payment.paymentDate), "MMM dd, yyyy")}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{payment.member.fullName}</span>
                  <span className="text-xs text-muted-foreground">{payment.member.memberId}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{payment.membership.membershipType}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-emerald-600">₹{payment.amountPaid}</span>
                  {payment.balanceAmount > 0 && <span className="text-[10px] text-rose-500">Bal: ₹{payment.balanceAmount}</span>}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{payment.paymentMethod}</span>
              </TableCell>
              <TableCell>
                <Badge className={
                  payment.status === 'Paid' ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25" :
                  payment.status === 'Partial' ? "bg-amber-500/15 text-amber-600 hover:bg-amber-500/25" :
                  "bg-rose-500/15 text-rose-600 hover:bg-rose-500/25"
                }>
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/receipt/${payment.id}`} target="_blank">
                  <Button variant="ghost" size="icon">
                    <Printer className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
