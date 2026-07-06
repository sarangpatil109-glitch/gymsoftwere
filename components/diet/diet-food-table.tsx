import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DietFood } from "@/types/fitness";
import { Edit, Trash2 } from "lucide-react";

interface DietFoodTableProps {
  foods: DietFood[];
  onEdit: (food: DietFood) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function DietFoodTable({ foods, onEdit, onDelete, isDeleting }: DietFoodTableProps) {
  return (
    <div className="rounded-md border bg-card w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Food / Meal</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Portion</TableHead>
            <TableHead>Macros</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foods.map((food) => (
            <TableRow key={food.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{food.food_name}</span>
                  {(food.supplements || food.water_intake) && (
                    <span className="text-xs text-muted-foreground">
                      {food.supplements} {food.water_intake ? ` | ${food.water_intake}` : ''}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{food.meal_category}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{food.quantity}</TableCell>
              <TableCell>
                <div className="flex flex-col text-xs text-muted-foreground gap-1">
                  <span className="font-semibold text-foreground">{food.calories} kcal</span>
                  <span>P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(food)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this meal?")) {
                      onDelete(food.id);
                    }
                  }}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
