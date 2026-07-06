import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Exercise } from "@/types/fitness";
import { useCreateExercise, useUpdateExercise } from "@/hooks/useWorkout";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const exerciseSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  equipment: z.string().optional(),
  instructions: z.string().optional(),
  default_sets: z.number().optional(),
  default_reps: z.number().optional(),
  default_rest_time: z.string().optional(),
  video_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type ExerciseFormValues = z.infer<typeof exerciseSchema>;

interface ExerciseFormModalProps {
  exercise?: Exercise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExerciseFormModal({ exercise, open, onOpenChange }: ExerciseFormModalProps) {
  const isEditing = !!exercise;
  const createExercise = useCreateExercise();
  const updateExercise = useUpdateExercise();

  const { register, handleSubmit, setValue, reset, watch, formState: { errors, isSubmitting } } = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: "",
      category: "",
      difficulty: "Beginner",
      equipment: "",
      instructions: "",
      default_sets: 3,
      default_reps: 10,
      default_rest_time: "60s",
      video_url: "",
      notes: "",
    }
  });

  const category = watch("category");
  const difficulty = watch("difficulty");

  useEffect(() => {
    if (open) {
      if (exercise) {
        reset({
          name: exercise.name,
          category: exercise.category,
          difficulty: exercise.difficulty,
          equipment: exercise.equipment || "",
          instructions: exercise.instructions || "",
          default_sets: exercise.default_sets || 3,
          default_reps: exercise.default_reps || 10,
          default_rest_time: exercise.default_rest_time || "60s",
          video_url: exercise.video_url || "",
          notes: exercise.notes || "",
        });
      } else {
        reset({
          name: "",
          category: "",
          difficulty: "Beginner",
          equipment: "",
          instructions: "",
          default_sets: 3,
          default_reps: 10,
          default_rest_time: "60s",
          video_url: "",
          notes: "",
        });
      }
    }
  }, [open, exercise, reset]);

  const onSubmit = async (data: ExerciseFormValues) => {
    try {
      if (isEditing) {
        await updateExercise.mutateAsync({ id: exercise.id, exercise: data });
      } else {
        await createExercise.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (err) {
      // errors handled by hooks
    }
  };

  const isPending = createExercise.isPending || updateExercise.isPending || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Exercise" : "Add New Exercise"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update exercise details below." : "Add a new exercise to the library."}
          </DialogDescription>
        </DialogHeader>

        <form id="exercise-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Exercise Name *</Label>
              <Input {...register("name")} placeholder="e.g. Barbell Bench Press" />
              {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select onValueChange={(val) => setValue("category", val as string)} value={category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {["Chest", "Back", "Shoulders", "Legs", "Biceps", "Triceps", "Core", "Cardio", "HIIT", "CrossFit", "Yoga"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-rose-500">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Difficulty *</Label>
              <Select onValueChange={(val) => setValue("difficulty", val as string)} value={difficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              {errors.difficulty && <p className="text-xs text-rose-500">{errors.difficulty.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Equipment Needed</Label>
              <Input {...register("equipment")} placeholder="e.g. Barbell, Bench" />
            </div>

            <div className="space-y-2">
              <Label>Video URL</Label>
              <Input {...register("video_url")} placeholder="YouTube link..." />
              {errors.video_url && <p className="text-xs text-rose-500">{errors.video_url.message}</p>}
            </div>

            <div className="space-y-2 col-span-2 grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Default Sets</Label>
                <Input type="number" {...register("default_sets", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Default Reps</Label>
                <Input type="number" {...register("default_reps", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Rest Time</Label>
                <Input {...register("default_rest_time")} placeholder="e.g. 60s" />
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Instructions</Label>
              <Textarea {...register("instructions")} placeholder="Step-by-step instructions..." className="h-24" />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Notes / Tips</Label>
              <Input {...register("notes")} placeholder="Form cues, breathing tips..." />
            </div>
          </div>
        </form>

        <DialogFooter className="pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
          <Button type="submit" form="exercise-form" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving..." : isEditing ? "Save Changes" : "Add Exercise"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
