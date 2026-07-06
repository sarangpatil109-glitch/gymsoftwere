"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gymProfileSchema, GymProfileFormValues } from "@/validation/settingsSchema";
import { useGymProfile, useUpdateGymProfile } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export function GymProfileSettings() {
  const { data: profile, isLoading } = useGymProfile();
  const updateProfile = useUpdateGymProfile();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GymProfileFormValues>({
    resolver: zodResolver(gymProfileSchema),
    defaultValues: {
      gymName: "GymOS",
      timezone: "Asia/Kolkata",
      currency: "INR",
    }
  });

  useEffect(() => {
    if (profile) {
      reset({
        gymName: profile.gymName || "",
        ownerName: profile.ownerName || "",
        mobile: profile.mobile || "",
        email: profile.email || "",
        website: profile.website || "",
        gstNumber: profile.gstNumber || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "",
        pincode: profile.pincode || "",
        timezone: profile.timezone || "Asia/Kolkata",
        currency: profile.currency || "INR",
        businessHours: profile.businessHours || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: GymProfileFormValues) => {
    updateProfile.mutate({
      ...data,
      socialMedia: profile?.socialMedia || {}
    });
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">Gym Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your gym&apos;s basic information and contact details.</p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <form id="gym-profile-form" onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Gym Name *</Label>
              <Input {...register("gymName")} placeholder="e.g. FitLife Gym" />
              {errors.gymName && <p className="text-xs text-destructive">{errors.gymName.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Owner Name</Label>
              <Input {...register("ownerName")} placeholder="Owner's full name" />
            </div>

            <div className="space-y-2">
              <Label>Mobile Number</Label>
              <Input {...register("mobile")} placeholder="Contact number" />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...register("email")} placeholder="gym@example.com" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Website</Label>
              <Input {...register("website")} placeholder="https://www.example.com" />
              {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>GST Number</Label>
              <Input {...register("gstNumber")} placeholder="GSTIN" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Address</Label>
              <Input {...register("address")} placeholder="Street address" />
            </div>

            <div className="space-y-2">
              <Label>City</Label>
              <Input {...register("city")} />
            </div>

            <div className="space-y-2">
              <Label>State</Label>
              <Input {...register("state")} />
            </div>

            <div className="space-y-2">
              <Label>Country</Label>
              <Input {...register("country")} />
            </div>

            <div className="space-y-2">
              <Label>Pincode</Label>
              <Input {...register("pincode")} />
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Input {...register("timezone")} />
            </div>

            <div className="space-y-2">
              <Label>Currency (e.g. INR, USD)</Label>
              <Input {...register("currency")} />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label>Business Hours</Label>
              <Input {...register("businessHours")} placeholder="e.g. Mon-Sat: 6 AM - 10 PM" />
            </div>
          </div>
        </form>
      </div>

      <div className="px-6 py-4 border-t bg-muted/20 flex justify-end">
        <Button type="submit" form="gym-profile-form" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
