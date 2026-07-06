import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DietFood } from "@/types/fitness";
import { useCreateDietFood, useUpdateDietFood } from "@/hooks/useDiet";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const dietFoodSchema = z.object({
  food_name: z.string().min(2, "Food name is required"),
  meal_category: z.string().min(1, "Meal category is required"),
  quantity: z.string().min(1, "Quantity/Portion is required"),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  water_intake: z.string().optional(),
  supplements: z.string().optional(),
});

type DietFoodFormValues = z.infer<typeof dietFoodSchema>;

interface DietFoodFormModalProps {
  food?: DietFood | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DietFoodFormModal({ food, open, onOpenChange }: DietFoodFormModalProps) {
  const isEditing = !!food;
  const createFood = useCreateDietFood();
  const updateFood = useUpdateDietFood();

  const { register, handleSubmit, setValue, reset, watch, formState: { errors, isSubmitting } } = useForm<DietFoodFormValues>({
    resolver: zodResolver(dietFoodSchema),
    defaultValues: {
      food_name: "",
      meal_category: "Lunch",
      quantity: "1 serving",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      water_intake: "",
      supplements: "",
    }
  });

  const meal_category = watch("meal_category");

  useEffect(() => {
    if (open) {
      if (food) {
        reset({
          food_name: food.food_name,
          meal_category: food.meal_category,
          quantity: food.quantity || "1 serving",
          calories: food.calories || 0,
          protein: food.protein || 0,
          carbs: food.carbs || 0,
          fat: food.fat || 0,
          water_intake: food.water_intake || "",
          supplements: food.supplements || "",
        });
      } else {
        reset({
          food_name: "",
          meal_category: "Lunch",
          quantity: "1 serving",
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          water_intake: "",
          supplements: "",
        });
      }
    }
  }, [open, food, reset]);

  const onSubmit = async (data: DietFoodFormValues) => {
    try {
      if (isEditing) {
        await updateFood.mutateAsync({ id: food.id, food: data });
      } else {
        await createFood.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (err) {
      // errors handled by hooks
    }
  };

  const isPending = createFood.isPending || updateFood.isPending || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Food" : "Add New Food"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update meal details below." : "Add a new food/meal to the library."}
          </DialogDescription>
        </DialogHeader>

        <form id="food-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label>Food / Meal Name *</Label>
              <Input {...register("food_name")} placeholder="e.g. Grilled Chicken Salad" />
              {errors.food_name && <p className="text-xs text-rose-500">{errors.food_name.message}</p>}
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label>Meal Category *</Label>
              <Select onValueChange={(val) => setValue("meal_category", val as string)} value={meal_category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {["Breakfast", "Snack", "Lunch", "Pre Workout", "Post Workout", "Dinner"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.meal_category && <p className="text-xs text-rose-500">{errors.meal_category.message}</p>}
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label>Portion / Quantity *</Label>
              <Input {...register("quantity")} placeholder="e.g. 200g, 1 bowl" />
              {errors.quantity && <p className="text-xs text-rose-500">{errors.quantity.message}</p>}
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label>Calories (kcal)</Label>
              <Input type="number" {...register("calories", { valueAsNumber: true })} />
            </div>

            <div className="grid grid-cols-3 gap-4 col-span-2">
              <div className="space-y-2">
                <Label>Protein (g)</Label>
                <Input type="number" {...register("protein", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Carbs (g)</Label>
                <Input type="number" {...register("carbs", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Fat (g)</Label>
                <Input type="number" {...register("fat", { valueAsNumber: true })} />
              </div>
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label>Water Intake (Optional)</Label>
              <Input {...register("water_intake")} placeholder="e.g. 500ml before meal" />
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label>Supplements (Optional)</Label>
              <Input {...register("supplements")} placeholder="e.g. 1 scoop whey" />
            </div>
          </div>
        </form>

        <DialogFooter className="pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
          <Button type="submit" form="food-form" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving..." : isEditing ? "Save Changes" : "Add Food"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
