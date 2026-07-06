"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateLead } from "@/hooks/useCRM";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { LeadStage, LeadSource, FitnessGoal } from "@/types/crm";

const STAGES: LeadStage[] = ["New", "Contacted", "Interested", "Trial Scheduled", "Trial Completed", "Negotiation", "Joined", "Lost"];
const SOURCES: LeadSource[] = ["Walk-In", "Facebook", "Instagram", "Google", "Website", "WhatsApp", "Reference", "Other"];
const GOALS: FitnessGoal[] = ["Weight Loss", "Weight Gain", "Muscle Gain", "Fitness", "Bodybuilding"];

const leadSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  mobile: z.string().min(10, "Valid mobile number required"),
  whatsapp: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  gender: z.enum(["Male", "Female", "Other"]),
  age: z.coerce.number().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
  fitnessGoal: z.string().optional(),
  leadSource: z.string().optional(),
  budget: z.coerce.number().optional(),
  preferredBatch: z.string().optional(),
  trainerPreference: z.string().optional(),
  medicalConditions: z.string().optional(),
  notes: z.string().optional(),
  stage: z.string().default("New"),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export default function AddLeadPage() {
  const router = useRouter();
  const createLead = useCreateLead();

  const form = useForm<LeadFormValues>({
    // @ts-expect-error Resolver type mismatch for age/email optionality
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: "",
      mobile: "",
      whatsapp: "",
      email: "",
      gender: "Male",
      stage: "New",
    },
  });

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = form;

  const onSubmit = async (data: LeadFormValues) => {
    await createLead.mutateAsync(data as any);
    router.push("/crm/board");
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div>
        <h3 className="text-lg font-medium">Add New Lead</h3>
        <p className="text-sm text-muted-foreground">Enter the details of a new prospect.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input {...register("fullName")} placeholder="Jane Doe" />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Mobile Number *</Label>
              <Input {...register("mobile")} placeholder="e.g. 555-0100" />
              {errors.mobile && <p className="text-xs text-destructive">{errors.mobile.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Number</Label>
              <Input {...register("whatsapp")} placeholder="Same as mobile if empty" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select onValueChange={(val) => setValue("gender", val as any)} defaultValue={watch("gender")}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input type="number" {...register("age")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Address</Label>
              <Input {...register("address")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Lead Stage</Label>
              <Select onValueChange={(val) => setValue("stage", val as any)} defaultValue={watch("stage")}>
                <SelectTrigger><SelectValue placeholder="Select Stage" /></SelectTrigger>
                <SelectContent>
                  {STAGES.map(stage => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lead Source</Label>
              <Select onValueChange={(val) => setValue("leadSource", val as any)} defaultValue={watch("leadSource")}>
                <SelectTrigger><SelectValue placeholder="Select Source" /></SelectTrigger>
                <SelectContent>
                  {SOURCES.map(source => <SelectItem key={source} value={source}>{source}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fitness Goal</Label>
              <Select onValueChange={(val) => setValue("fitnessGoal", val as any)} defaultValue={watch("fitnessGoal")}>
                <SelectTrigger><SelectValue placeholder="Select Goal" /></SelectTrigger>
                <SelectContent>
                  {GOALS.map(goal => <SelectItem key={goal} value={goal}>{goal}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Occupation</Label>
              <Input {...register("occupation")} />
            </div>
            <div className="space-y-2">
              <Label>Estimated Budget (₹)</Label>
              <Input type="number" {...register("budget")} />
            </div>
            <div className="space-y-2">
              <Label>Preferred Batch Time</Label>
              <Input {...register("preferredBatch")} placeholder="e.g. Morning 6 AM" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Medical Conditions</Label>
              <Textarea {...register("medicalConditions")} placeholder="Asthma, Injuries, etc." />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea {...register("notes")} placeholder="Any other details to remember." />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Lead
          </Button>
        </div>
      </form>
    </div>
  );
}
