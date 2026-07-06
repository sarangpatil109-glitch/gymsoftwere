"use client";

import { useState } from "react";
import { useMembershipPlans, useSaveMembershipPlan, useDeleteMembershipPlan, useToggleMembershipPlan } from "@/hooks/useMembershipPlans";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { membershipPlanSchema, MembershipPlanFormValues } from "@/validation/settingsSchema";
import { MembershipPlan } from "@/types/settings";

export function MembershipPlansSettings() {
  const { data: plans, isLoading } = useMembershipPlans();
  const togglePlan = useToggleMembershipPlan();
  const deletePlan = useDeleteMembershipPlan();
  const savePlan = useSaveMembershipPlan();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const form = useForm<MembershipPlanFormValues>({
    resolver: zodResolver(membershipPlanSchema),
    defaultValues: {
      planName: "",
      duration: "Monthly",
      price: 0,
      discount: 0,
      finalPrice: 0,
      color: "#3b82f6",
      displayOrder: 0,
      isDefault: false,
      isActive: true,
    }
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = form;

  const openModal = (plan?: MembershipPlan) => {
    if (plan) {
      setEditingPlan(plan);
      reset({
        planName: plan.planName,
        duration: plan.duration as "Monthly" | "Quarterly" | "Half Yearly" | "Yearly",
        price: plan.price,
        discount: plan.discount,
        finalPrice: plan.finalPrice,
        description: plan.description || "",
        color: plan.color,
        displayOrder: plan.displayOrder,
        isDefault: plan.isDefault,
        isActive: plan.isActive,
      });
    } else {
      setEditingPlan(null);
      reset({
        planName: "",
        duration: "Monthly",
        price: 0,
        discount: 0,
        finalPrice: 0,
        description: "",
        color: "#3b82f6",
        displayOrder: 0,
        isDefault: false,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = (data: MembershipPlanFormValues) => {
    savePlan.mutate({ data, id: editingPlan?.id }, {
      onSuccess: () => setIsModalOpen(false)
    });
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b flex justify-between items-center bg-background sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-semibold">Membership Plans</h2>
          <p className="text-sm text-muted-foreground">Manage your gym&apos;s membership offerings.</p>
        </div>
        <Button onClick={() => openModal()}><Plus className="w-4 h-4 mr-2" /> Add Plan</Button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans?.map((plan) => (
            <div key={plan.id} className={`border rounded-lg p-4 flex flex-col shadow-sm transition-all ${!plan.isActive ? 'opacity-60 bg-muted/50' : 'bg-card'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: plan.color }}></div>
                  <h3 className="font-semibold text-lg">{plan.planName}</h3>
                  {plan.isDefault && <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Default</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={plan.isActive}
                    onCheckedChange={(val) => togglePlan.mutate({ id: plan.id, isActive: val })}
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openModal(plan)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => confirm("Delete this plan?") && deletePlan.mutate(plan.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mb-4">{plan.duration}</div>
              
              <div className="mt-auto flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">₹{plan.finalPrice}</div>
                  {plan.discount > 0 && <div className="text-xs line-through text-muted-foreground">₹{plan.price}</div>}
                </div>
              </div>
            </div>
          ))}
          
          {plans?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No membership plans found. Click Add Plan to create one.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
          </DialogHeader>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <form id="plan-form" onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 py-4">
            
            <div className="space-y-2">
              <Label>Plan Name *</Label>
              <Input {...register("planName")} placeholder="e.g. Pro Yearly Plan" />
              {errors.planName && <p className="text-xs text-destructive">{errors.planName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration *</Label>
                <Select onValueChange={(val: "Monthly" | "Quarterly" | "Half Yearly" | "Yearly" | null) => { if (val) setValue("duration", val) }} defaultValue={watch("duration")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Half Yearly">Half Yearly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Color Code</Label>
                <div className="flex gap-2">
                  <Input type="color" className="w-10 h-10 p-1" {...register("color")} />
                  <Input {...register("color")} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (₹) *</Label>
                <Input type="number" {...register("price", { 
                  valueAsNumber: true,
                  onChange: (e) => {
                    const price = parseFloat(e.target.value) || 0;
                    const discount = watch("discount") || 0;
                    setValue("finalPrice", price - discount);
                  }
                })} />
              </div>
              <div className="space-y-2">
                <Label>Discount (₹)</Label>
                <Input type="number" {...register("discount", { 
                  valueAsNumber: true,
                  onChange: (e) => {
                    const discount = parseFloat(e.target.value) || 0;
                    const price = watch("price") || 0;
                    setValue("finalPrice", price - discount);
                  }
                })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Final Price (₹) (Auto-calculated)</Label>
              <Input type="number" className="bg-muted" readOnly {...register("finalPrice", { valueAsNumber: true })} />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input {...register("description")} placeholder="Short description" />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch checked={watch("isDefault")} onCheckedChange={(val) => setValue("isDefault", val)} />
              <Label>Set as Default Plan</Label>
            </div>
            
          </form>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="plan-form" disabled={savePlan.isPending}>
              {savePlan.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Plan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
