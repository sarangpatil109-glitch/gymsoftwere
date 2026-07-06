import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema, PaymentFormValues } from "@/validation/paymentSchema";
import { useReceivePayment } from "@/hooks/usePayments";
import { Loader2 } from "lucide-react";
import { Member } from "@/types/member";
import { Membership } from "@/types/membership";

import { useEnabledPaymentMethods } from "@/hooks/usePaymentMethods";
import { useEffect } from "react";

interface ReceivePaymentModalProps {
  member: Member;
  membership: Membership;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceivePaymentModal({ member, membership, open, onOpenChange }: ReceivePaymentModalProps) {
  const receivePayment = useReceivePayment();
  const { data: paymentMethods, isLoading: isMethodsLoading } = useEnabledPaymentMethods();

  const pendingAmount = membership.finalAmount - (membership.amountPaid || 0);
  
  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      memberId: member.id,
      membershipId: membership.id,
      amountPaid: pendingAmount > 0 ? pendingAmount : 0,
      discount: 0,
      paymentMethod: "",
      transactionReference: "",
      remarks: "",
    }
  });

  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    if (open) {
      reset({
        memberId: member.id,
        membershipId: membership.id,
        amountPaid: pendingAmount > 0 ? pendingAmount : 0,
        discount: 0,
        paymentMethod: "",
        transactionReference: "",
        remarks: "",
      });
    }
  }, [open, member.id, membership.id, pendingAmount, reset]);

  const onSubmit = (data: PaymentFormValues) => {
    receivePayment.mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Receive Payment</DialogTitle>
          <DialogDescription>
            Process payment for {member.fullName}&apos;s {membership.membershipType} membership.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Payment Method</Label>
              {isMethodsLoading ? (
                <div className="flex h-10 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/> Loading methods...</div>
              ) : (
                <Select onValueChange={(val: string | null) => { if (val) setValue("paymentMethod", val) }} value={paymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods?.map(method => (
                      <SelectItem key={method.id} value={method.methodName}>{method.methodName}</SelectItem>
                    ))}
                    {paymentMethods?.length === 0 && <SelectItem value="Cash">Cash (Fallback)</SelectItem>}
                  </SelectContent>
                </Select>
              )}
              {errors.paymentMethod && <p className="text-xs text-rose-500">{errors.paymentMethod.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Amount Paid (₹)</Label>
              <Input type="number" {...register("amountPaid", { valueAsNumber: true })} />
              {errors.amountPaid && <p className="text-xs text-rose-500">{errors.amountPaid.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Additional Discount</Label>
              <Input type="number" {...register("discount", { valueAsNumber: true })} />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Transaction Reference (Optional)</Label>
              <Input placeholder="UPI Ref / Check No." {...register("transactionReference")} />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label>Remarks (Optional)</Label>
              <Textarea placeholder="Any notes..." {...register("remarks")} />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={receivePayment.isPending}>
              {receivePayment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Receive Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
