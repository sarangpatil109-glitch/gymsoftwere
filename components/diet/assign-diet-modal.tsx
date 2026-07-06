import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDietPlan } from "@/hooks/useDiet";
import { useDietFoods } from "@/hooks/useDiet";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Member } from "@/types/member";
import { useState } from "react";
import { DietPlanMeal } from "@/types/fitness";

interface AssignDietModalProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignDietModal({ member, open, onOpenChange }: AssignDietModalProps) {
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [proteinTarget, setProteinTarget] = useState(150);
  const [carbsTarget, setCarbsTarget] = useState(200);
  const [fatTarget, setFatTarget] = useState(60);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  
  const [meals, setMeals] = useState<(Partial<DietPlanMeal> & { tempId: number })[]>([]);
  const { data: foods, isLoading: isLoadingFoods } = useDietFoods();
  const createPlan = useCreateDietPlan();

  const handleAddMeal = () => {
    setMeals([...meals, { tempId: Date.now(), day_of_week: "Everyday" }]);
  };

  const handleRemoveMeal = (tempId: number) => {
    setMeals(meals.filter(m => m.tempId !== tempId));
  };

  const handleMealChange = (tempId: number, field: string, value: any) => {
    setMeals(meals.map(m => m.tempId === tempId ? { ...m, [field]: value } : m));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createPlan.mutateAsync({
      plan: {
        member_id: member.id,
        daily_calories: dailyCalories,
        protein_target: proteinTarget,
        carbs_target: carbsTarget,
        fat_target: fatTarget,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        notes
      },
      meals
    });
    
    // reset and close
    setMeals([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Diet Plan</DialogTitle>
          <DialogDescription>
            Create a nutrition plan for {member.fullName}.
          </DialogDescription>
        </DialogHeader>

        <form id="diet-form" onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Daily Calories (kcal) *</Label>
              <Input type="number" value={dailyCalories} onChange={e => setDailyCalories(parseInt(e.target.value))} required />
            </div>
            <div className="space-y-2">
              <Label>Protein (g) *</Label>
              <Input type="number" value={proteinTarget} onChange={e => setProteinTarget(parseInt(e.target.value))} required />
            </div>
            <div className="space-y-2">
              <Label>Carbs (g) *</Label>
              <Input type="number" value={carbsTarget} onChange={e => setCarbsTarget(parseInt(e.target.value))} required />
            </div>
            <div className="space-y-2">
              <Label>Fat (g) *</Label>
              <Input type="number" value={fatTarget} onChange={e => setFatTarget(parseInt(e.target.value))} required />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>General Notes</Label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Drink 3 liters of water daily..." />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Meal Schedule</h4>
              <Button type="button" variant="outline" size="sm" onClick={handleAddMeal}>
                <Plus className="h-4 w-4 mr-2" /> Add Meal
              </Button>
            </div>

            {meals.map((meal) => (
              <div key={meal.tempId} className="flex items-center gap-2 border rounded-lg p-2 bg-muted/10">
                <Select value={meal.day_of_week} onValueChange={(val) => handleMealChange(meal.tempId, "day_of_week", val as string)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Everyday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={meal.diet_library_id || ""} onValueChange={(val) => handleMealChange(meal.tempId, "diet_library_id", val as string)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select Food/Meal" />
                  </SelectTrigger>
                  <SelectContent>
                    {foods?.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.food_name} ({f.meal_category} - {f.calories}kcal)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button type="button" variant="ghost" size="icon" className="text-rose-500" onClick={() => handleRemoveMeal(meal.tempId)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

        </form>

        <DialogFooter className="pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createPlan.isPending}>Cancel</Button>
          <Button type="submit" form="diet-form" disabled={createPlan.isPending}>
            {createPlan.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Diet Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
