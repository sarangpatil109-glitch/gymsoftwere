/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Member, MemberStatus, FitnessGoal, PaymentStatus, Gender } from "@/types/member";
import { memberService } from "@/services/memberService";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addDays, differenceInYears, parseISO } from "date-fns";
import { useActiveMembershipPlans } from "@/hooks/useMembershipPlans";
import { Loader2 } from "lucide-react";

const memberSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  mobileNumber: z.string().min(10, "Valid mobile number required"),
  whatsappNumber: z.string().optional(),
  email: z.string().email("Invalid email address"),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  height: z.coerce.number().min(50, "Height must be valid").max(300),
  weight: z.coerce.number().min(20, "Weight must be valid").max(300),
  goal: z.enum(["Weight Loss", "Weight Gain", "Muscle Gain", "Fitness", "Bodybuilding"]),
  joiningDate: z.string().min(1, "Joining Date is required"),
  membershipType: z.string().min(1, "Membership type is required"),
  amount: z.coerce.number().min(0),
  discount: z.coerce.number().min(0),
  paymentStatus: z.enum(["Paid", "Partial", "Pending"]),
  medicalConditions: z.string().optional(),
  notes: z.string().optional(),
});

type MemberFormValues = z.infer<typeof memberSchema>;

interface MemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Member;
  prefillData?: Partial<Member>;
  onSave: (member: Member) => void;
}

export function MemberModal({ open, onOpenChange, initialData, prefillData, onSave }: MemberModalProps) {
  const isEditing = !!initialData;
  const { data: membershipPlans, isLoading: isPlansLoading } = useActiveMembershipPlans();

  const form = useForm<MemberFormValues>({
    // @ts-expect-error Zod coerce mismatch with RHF resolver
    resolver: zodResolver(memberSchema),
    defaultValues: {
      fullName: "",
      gender: "Male",
      dateOfBirth: "",
      mobileNumber: "",
      whatsappNumber: "",
      email: "",
      address: "",
      emergencyContact: "",
      height: 0,
      weight: 0,
      goal: "Fitness",
      joiningDate: new Date().toISOString().split("T")[0],
      membershipType: "",
      amount: 0,
      discount: 0,
      paymentStatus: "Pending",
      medicalConditions: "",
      notes: "",
    },
  });

  const { watch, setValue, reset, register, formState: { errors } } = form;

  // Auto Calculations
  const dob = watch("dateOfBirth");
  const height = watch("height");
  const weight = watch("weight");
  const amount = watch("amount");
  const discount = watch("discount");
  const joiningDate = watch("joiningDate");
  const membershipType = watch("membershipType");

  const [calculatedAge, setCalculatedAge] = useState(0);
  const [calculatedBmi, setCalculatedBmi] = useState(0);
  const [calculatedFinalAmount, setCalculatedFinalAmount] = useState(0);
  const [calculatedExpiry, setCalculatedExpiry] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData && open) {
      reset({
        ...initialData,
        membershipType: initialData.membershipType || "",
      });
      setSelectedFile(null);
    } else if (prefillData && open && !isEditing) {
      reset({
        ...form.getValues(), // preserve default values
        ...prefillData,      // override with prefill data
        membershipType: "",
      });
      setSelectedFile(null);
    } else if (!open) {
      reset();
      setSelectedFile(null);
    }
  }, [initialData, prefillData, open, reset, isEditing, form]);

  useEffect(() => {
    if (dob) {
      try {
        setCalculatedAge(differenceInYears(new Date(), parseISO(dob)));
      } catch { setCalculatedAge(0); }
    }
  }, [dob]);

  useEffect(() => {
    if (height && weight) {
      const heightInMeters = height / 100;
      setCalculatedBmi(Number((weight / (heightInMeters * heightInMeters)).toFixed(1)));
    }
  }, [height, weight]);

  useEffect(() => {
    setCalculatedFinalAmount(Math.max(0, (amount || 0) - (discount || 0)));
  }, [amount, discount]);

  useEffect(() => {
    if (joiningDate && membershipType && membershipPlans) {
      try {
        const join = parseISO(joiningDate);
        const plan = membershipPlans.find(p => p.planName === membershipType);
        if (!plan) return;
        
        let days = 0;
        switch (plan.duration) {
          case "Monthly": days = 30; break;
          case "Quarterly": days = 90; break;
          case "Half Yearly": days = 180; break;
          case "Yearly": days = 365; break;
          default: days = 30; break;
        }
        setCalculatedExpiry(addDays(join, days).toISOString().split("T")[0]);
      } catch { setCalculatedExpiry(""); }
    }
  }, [joiningDate, membershipType, membershipPlans]);

  const onSubmit = async (data: MemberFormValues) => {
    setIsUploading(true);
    let uploadedPhotoUrl = initialData?.photoUrl || "";

    try {
      if (selectedFile) {
        uploadedPhotoUrl = await memberService.uploadPhoto(selectedFile);
      }
    } catch (error: unknown) {
      toast.error("Failed to upload photo", { description: (error as Error).message });
      setIsUploading(false);
      return;
    }

    const id = initialData?.id || ""; // ID will be ignored on create by service or handled by DB
    const status: MemberStatus = new Date(calculatedExpiry) >= new Date() ? "Active" : "Expired";

    const member: Partial<Member> = {
      ...data,
      photoUrl: uploadedPhotoUrl,
      age: calculatedAge,
      bmi: calculatedBmi,
      finalAmount: calculatedFinalAmount,
      expiryDate: calculatedExpiry,
      status,
    };
    
    if (id) member.id = id;

    await onSave(member as Member);
    setIsUploading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 overflow-hidden flex flex-col bg-background">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle>{isEditing ? "Edit Member" : "Add New Member"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update member details below." : "Fill in the details to add a new member. Some fields will auto-calculate."}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 overflow-y-auto">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <form id="member-form" onSubmit={form.handleSubmit(onSubmit as any)} className="p-6 space-y-8">
            
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
              
              <div className="space-y-2 mb-4">
                <Label>Profile Photo</Label>
                <div className="flex items-center gap-4">
                  {initialData?.photoUrl && !selectedFile && (
                    <img src={initialData.photoUrl} alt="Profile" className="h-16 w-16 rounded-full object-cover border" />
                  )}
                  {selectedFile && (
                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="h-16 w-16 rounded-full object-cover border" />
                  )}
                  <Input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="w-full max-w-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input {...register("fullName")} placeholder="John Doe" />
                  {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select onValueChange={(val: string | null) => val && setValue("gender", val as Gender)} defaultValue={watch("gender")}>
                    <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth *</Label>
                  <Input type="date" {...register("dateOfBirth")} />
                  {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Age (Auto)</Label>
                  <Input value={calculatedAge} readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Mobile Number *</Label>
                  <Input {...register("mobileNumber")} placeholder="e.g. 555-0100" />
                  {errors.mobileNumber && <p className="text-xs text-destructive">{errors.mobileNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp Number</Label>
                  <Input {...register("whatsappNumber")} />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" {...register("email")} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Emergency Contact</Label>
                  <Input {...register("emergencyContact")} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address</Label>
                  <Input {...register("address")} />
                </div>
              </div>
            </div>

            {/* Body Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Body Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Height (cm) *</Label>
                  <Input type="number" {...register("height")} />
                  {errors.height && <p className="text-xs text-destructive">{errors.height.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg) *</Label>
                  <Input type="number" {...register("weight")} />
                  {errors.weight && <p className="text-xs text-destructive">{errors.weight.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">BMI (Auto)</Label>
                  <Input value={calculatedBmi} readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Fitness Goal *</Label>
                  <Select onValueChange={(val: string | null) => val && setValue("goal", val as FitnessGoal)} defaultValue={watch("goal")}>
                    <SelectTrigger><SelectValue placeholder="Select Goal" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                      <SelectItem value="Weight Gain">Weight Gain</SelectItem>
                      <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                      <SelectItem value="Fitness">Fitness</SelectItem>
                      <SelectItem value="Bodybuilding">Bodybuilding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Membership */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Membership</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Joining Date *</Label>
                  <Input type="date" {...register("joiningDate")} />
                </div>
                <div className="space-y-2">
                  <Label>Membership Type *</Label>
                  {isPlansLoading ? (
                    <div className="flex h-10 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/> Loading plans...</div>
                  ) : (
                    <Select 
                      onValueChange={(val: string | null) => {
                        if (val) {
                          setValue("membershipType", val);
                          const selectedPlan = membershipPlans?.find(p => p.planName === val);
                          if (selectedPlan && !isEditing) {
                            setValue("amount", selectedPlan.price);
                            setValue("discount", selectedPlan.discount);
                          }
                        }
                      }} 
                      defaultValue={watch("membershipType") || ""}
                    >
                      <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                      <SelectContent>
                        {membershipPlans?.map(plan => (
                          <SelectItem key={plan.id} value={plan.planName}>{plan.planName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Amount (₹) *</Label>
                  <Input type="number" {...register("amount")} />
                </div>
                <div className="space-y-2">
                  <Label>Discount (₹)</Label>
                  <Input type="number" {...register("discount")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Final Amount (Auto)</Label>
                  <Input value={`₹${calculatedFinalAmount}`} readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Expiry Date (Auto)</Label>
                  <Input value={calculatedExpiry} readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Payment Status *</Label>
                  <Select onValueChange={(val: string | null) => val && setValue("paymentStatus", val as PaymentStatus)} defaultValue={watch("paymentStatus")}>
                    <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Partial">Partial</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Extra */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Extra</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Medical Conditions (if any)</Label>
                  <Textarea {...register("medicalConditions")} placeholder="Asthma, back pain, etc." />
                </div>
                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea {...register("notes")} />
                </div>
              </div>
            </div>
            
          </form>
        </ScrollArea>
        
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isUploading || form.formState.isSubmitting}>Cancel</Button>
          <Button type="submit" form="member-form" disabled={isUploading || form.formState.isSubmitting}>
            {(isUploading || form.formState.isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {(isUploading || form.formState.isSubmitting) ? "Saving..." : isEditing ? "Save Changes" : "Add Member"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Export wrappers to satisfy the specific component names requested
export function AddMemberModal({ open, onOpenChange, prefillData, onSave }: Omit<MemberModalProps, "initialData">) {
  return <MemberModal open={open} onOpenChange={onOpenChange} prefillData={prefillData} onSave={onSave} />;
}

export function EditMemberModal({ open, onOpenChange, initialData, onSave }: MemberModalProps) {
  return <MemberModal open={open} onOpenChange={onOpenChange} initialData={initialData} onSave={onSave} />;
}
