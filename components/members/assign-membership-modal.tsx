import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { membershipSchema, MembershipFormValues } from "@/validation/membershipSchema";
import { useAssignMembership } from "@/hooks/useMemberships";
import { Loader2 } from "lucide-react";
import { Member } from "@/types/member";
import { MembershipType } from "@/types/membership";
import { useActiveMembershipPlans } from "@/hooks/useMembershipPlans";
import { useEffect } from "react";

interface AssignMembershipModalProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignMembershipModal({ member, open, onOpenChange }: AssignMembershipModalProps) {
  const assignMembership = useAssignMembership();
  const { data: membershipPlans, isLoading: isPlansLoading } = useActiveMembershipPlans();

  const { register, handleSubmit, setValue, reset, getValues, watch, formState: { errors } } = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      memberId: member.id,
      membershipType: "",
      startDate: new Date().toISOString().split("T")[0],
      amount: 0,
      discount: 0,
      finalAmount: 0,
    }
  });

  const membershipType = watch("membershipType");

  // Reset form when opened
  useEffect(() => {
    if (open) {
      reset({
        memberId: member.id,
        membershipType: "Monthly",
        startDate: new Date().toISOString().split("T")[0],
        amount: 1000,
        discount: 0,
        finalAmount: 1000,
      });
    }
  }, [open, member.id, reset]);

  const onSubmit = (data: MembershipFormValues) => {
    assignMembership.mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Membership</DialogTitle>
          <DialogDescription>
            Assign a new membership plan to {member.fullName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Membership Type</Label>
              <Label>Membership Plan</Label>
              {isPlansLoading ? (
                <div className="flex h-10 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/> Loading plans...</div>
              ) : (
                <Select 
                  onValueChange={(val: string | null) => {
                    if (!val) return;
                    setValue("membershipType", val as MembershipType);
                    const selectedPlan = membershipPlans?.find(p => p.planName === val);
                    if (selectedPlan) {
                      setValue("amount", selectedPlan.price);
                      setValue("discount", selectedPlan.discount);
                      setValue("finalAmount", selectedPlan.finalPrice);
                    }
                  }} 
                  value={membershipType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {membershipPlans?.map(plan => (
                      <SelectItem key={plan.id} value={plan.planName}>{plan.planName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.membershipType && <p className="text-xs text-rose-500">{errors.membershipType.message}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Start Date</Label>
              <Input type="date" {...register("startDate")} />
              {errors.startDate && <p className="text-xs text-rose-500">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input 
                type="number" 
                {...register("amount", { 
                  valueAsNumber: true,
                  onChange: (e) => {
                    const amt = parseFloat(e.target.value) || 0;
                    const disc = getValues("discount") || 0;
                    setValue("finalAmount", amt - disc);
                  }
                })} 
              />
              {errors.amount && <p className="text-xs text-rose-500">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Discount (₹)</Label>
              <Input 
                type="number" 
                {...register("discount", { 
                  valueAsNumber: true,
                  onChange: (e) => {
                    const disc = parseFloat(e.target.value) || 0;
                    const amt = getValues("amount") || 0;
                    setValue("finalAmount", amt - disc);
                  }
                })} 
              />
              {errors.discount && <p className="text-xs text-rose-500">{errors.discount.message}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Final Amount (₹)</Label>
              <Input type="number" readOnly className="bg-muted" {...register("finalAmount", { valueAsNumber: true })} />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={assignMembership.isPending}>
              {assignMembership.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Membership
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
