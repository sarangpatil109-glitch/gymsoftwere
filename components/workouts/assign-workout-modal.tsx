import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateWorkoutPlan } from "@/hooks/useWorkout";
import { useExercises } from "@/hooks/useWorkout";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Member } from "@/types/member";
import { useState } from "react";
import { WorkoutDay, WorkoutExercise } from "@/types/fitness";

interface AssignWorkoutModalProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignWorkoutModal({ member, open, onOpenChange }: AssignWorkoutModalProps) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  
  const [days, setDays] = useState<(Partial<WorkoutDay> & { tempId: number })[]>([]);
  const { data: exercises, isLoading: isLoadingExercises } = useExercises();
  const createPlan = useCreateWorkoutPlan();

  const handleAddDay = () => {
    setDays([...days, { tempId: Date.now(), day_of_week: "Monday", exercises: [] }]);
  };

  const handleRemoveDay = (tempId: number) => {
    setDays(days.filter(d => d.tempId !== tempId));
  };

  const handleDayChange = (tempId: number, day_of_week: string) => {
    setDays(days.map(d => d.tempId === tempId ? { ...d, day_of_week } : d));
  };

  const handleAddExercise = (dayId: number) => {
    setDays(days.map(d => {
      if (d.tempId === dayId) {
        return {
          ...d,
          exercises: [...(d.exercises || []), { sort_order: (d.exercises?.length || 0) } as WorkoutExercise]
        };
      }
      return d;
    }));
  };

  const handleExerciseChange = (dayId: number, exIndex: number, field: string, value: any) => {
    setDays(days.map(d => {
      if (d.tempId === dayId) {
        const newExercises = [...(d.exercises || [])];
        if (field === 'exercise_id') {
            const exercise = exercises?.find(e => e.id === value);
            newExercises[exIndex] = { 
                ...newExercises[exIndex], 
                [field]: value,
                sets: exercise?.default_sets || 3,
                reps: exercise?.default_reps || 10,
                rest_time: exercise?.default_rest_time || "60s"
            };
        } else {
            newExercises[exIndex] = { ...newExercises[exIndex], [field]: value };
        }
        return { ...d, exercises: newExercises };
      }
      return d;
    }));
  };

  const handleRemoveExercise = (dayId: number, exIndex: number) => {
    setDays(days.map(d => {
      if (d.tempId === dayId) {
        const newExercises = [...(d.exercises || [])];
        newExercises.splice(exIndex, 1);
        return { ...d, exercises: newExercises };
      }
      return d;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("Workout Name is required");
    
    await createPlan.mutateAsync({
      plan: {
        member_id: member.id,
        name,
        goal,
        start_date: startDate || undefined,
        end_date: endDate || undefined
      },
      days
    });
    
    // reset and close
    setName("");
    setGoal("");
    setDays([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Workout Plan</DialogTitle>
          <DialogDescription>
            Create a custom workout plan for {member.fullName}.
          </DialogDescription>
        </DialogHeader>

        <form id="workout-form" onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Workout Plan Name *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. 12-Week Hypertrophy" required />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Goal</Label>
              <Input value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g. Build muscle mass" />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Workout Days</h4>
              <Button type="button" variant="outline" size="sm" onClick={handleAddDay}>
                <Plus className="h-4 w-4 mr-2" /> Add Day
              </Button>
            </div>

            {days.map((day, dIdx) => (
              <div key={day.tempId} className="border rounded-lg p-4 bg-muted/10 space-y-4">
                <div className="flex items-center gap-4">
                  <Select value={day.day_of_week} onValueChange={(val) => handleDayChange(day.tempId, val as string)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Day 1", "Day 2", "Day 3"].map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="ghost" size="icon" className="text-rose-500 ml-auto" onClick={() => handleRemoveDay(day.tempId)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {day.exercises?.map((ex, eIdx) => (
                    <div key={eIdx} className="flex items-center gap-2">
                      <Select value={ex.exercise_id || ""} onValueChange={(val) => handleExerciseChange(day.tempId, eIdx, "exercise_id", val as string)}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select Exercise" />
                        </SelectTrigger>
                        <SelectContent>
                          {exercises?.map(e => (
                            <SelectItem key={e.id} value={e.id}>{e.name} ({e.category})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input type="number" placeholder="Sets" className="w-16" value={ex.sets || ""} onChange={e => handleExerciseChange(day.tempId, eIdx, "sets", parseInt(e.target.value))} title="Sets" />
                      <Input type="number" placeholder="Reps" className="w-16" value={ex.reps || ""} onChange={e => handleExerciseChange(day.tempId, eIdx, "reps", parseInt(e.target.value))} title="Reps" />
                      <Input placeholder="Rest" className="w-20" value={ex.rest_time || ""} onChange={e => handleExerciseChange(day.tempId, eIdx, "rest_time", e.target.value)} title="Rest Time" />
                      <Input placeholder="Weight" className="w-20" value={ex.weight || ""} onChange={e => handleExerciseChange(day.tempId, eIdx, "weight", e.target.value)} title="Weight" />
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveExercise(day.tempId, eIdx)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleAddExercise(day.tempId)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Exercise
                  </Button>
                </div>
              </div>
            ))}
          </div>

        </form>

        <DialogFooter className="pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createPlan.isPending}>Cancel</Button>
          <Button type="submit" form="workout-form" disabled={createPlan.isPending}>
            {createPlan.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Workout Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
