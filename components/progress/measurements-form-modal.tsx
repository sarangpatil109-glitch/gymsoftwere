import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAddMeasurement } from "@/hooks/useProgress";
import { Member } from "@/types/member";

const measurementSchema = z.object({
  record_date: z.string().min(1, "Date is required"),
  weight: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  bmi: z.coerce.number().optional(),
  body_fat_percentage: z.coerce.number().optional(),
  muscle_percentage: z.coerce.number().optional(),
  chest: z.coerce.number().optional(),
  waist: z.coerce.number().optional(),
  hip: z.coerce.number().optional(),
  shoulders: z.coerce.number().optional(),
  biceps: z.coerce.number().optional(),
  forearm: z.coerce.number().optional(),
  thigh: z.coerce.number().optional(),
  calf: z.coerce.number().optional(),
  neck: z.coerce.number().optional(),
  resting_heart_rate: z.coerce.number().optional(),
  blood_pressure: z.string().optional(),
});

type MeasurementFormValues = z.infer<typeof measurementSchema>;

interface MeasurementsFormModalProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MeasurementsFormModal({ member, open, onOpenChange }: MeasurementsFormModalProps) {
  const addMeasurement = useAddMeasurement();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      record_date: new Date().toISOString().split('T')[0],
      weight: undefined, height: undefined, bmi: undefined,
      body_fat_percentage: undefined, muscle_percentage: undefined,
      chest: undefined, waist: undefined, hip: undefined, shoulders: undefined,
      biceps: undefined, forearm: undefined, thigh: undefined, calf: undefined, neck: undefined,
      resting_heart_rate: undefined, blood_pressure: "",
    }
  });

  const onSubmit = (data: MeasurementFormValues) => {
    addMeasurement.mutate({
      member_id: member.id,
      ...data,
    }, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Measurements</DialogTitle>
          <DialogDescription>
            Record new body measurements for {member.fullName}. Leave empty any fields you aren't tracking today.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          
          <div className="space-y-2">
            <Label>Date *</Label>
            <Input type="date" {...register("record_date")} />
            {errors.record_date && <p className="text-sm text-destructive">{errors.record_date.message}</p>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 md:col-span-4 bg-muted/30 p-2 rounded text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Core Metrics
            </div>
            
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input type="number" step="0.1" {...register("weight")} />
            </div>
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input type="number" step="0.1" {...register("height")} />
            </div>
            <div className="space-y-2">
              <Label>BMI</Label>
              <Input type="number" step="0.1" {...register("bmi")} />
            </div>
            <div className="space-y-2">
              <Label>Body Fat (%)</Label>
              <Input type="number" step="0.1" {...register("body_fat_percentage")} />
            </div>
            <div className="space-y-2">
              <Label>Muscle (%)</Label>
              <Input type="number" step="0.1" {...register("muscle_percentage")} />
            </div>
            <div className="space-y-2">
              <Label>Resting HR (bpm)</Label>
              <Input type="number" {...register("resting_heart_rate")} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Blood Pressure</Label>
              <Input placeholder="e.g. 120/80" {...register("blood_pressure")} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 md:col-span-4 bg-muted/30 p-2 rounded text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Circumferences (cm)
            </div>
            
            <div className="space-y-2">
              <Label>Neck</Label>
              <Input type="number" step="0.1" {...register("neck")} />
            </div>
            <div className="space-y-2">
              <Label>Shoulders</Label>
              <Input type="number" step="0.1" {...register("shoulders")} />
            </div>
            <div className="space-y-2">
              <Label>Chest</Label>
              <Input type="number" step="0.1" {...register("chest")} />
            </div>
            <div className="space-y-2">
              <Label>Biceps</Label>
              <Input type="number" step="0.1" {...register("biceps")} />
            </div>
            <div className="space-y-2">
              <Label>Forearm</Label>
              <Input type="number" step="0.1" {...register("forearm")} />
            </div>
            <div className="space-y-2">
              <Label>Waist</Label>
              <Input type="number" step="0.1" {...register("waist")} />
            </div>
            <div className="space-y-2">
              <Label>Hip</Label>
              <Input type="number" step="0.1" {...register("hip")} />
            </div>
            <div className="space-y-2">
              <Label>Thigh</Label>
              <Input type="number" step="0.1" {...register("thigh")} />
            </div>
            <div className="space-y-2">
              <Label>Calf</Label>
              <Input type="number" step="0.1" {...register("calf")} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={addMeasurement.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={addMeasurement.isPending}>
              {addMeasurement.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Measurements
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
