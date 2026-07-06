import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Exercise } from "@/types/fitness";
import { Edit, Trash2 } from "lucide-react";

interface ExerciseTableProps {
  exercises: Exercise[];
  onEdit: (exercise: Exercise) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function ExerciseTable({ exercises, onEdit, onDelete, isDeleting }: ExerciseTableProps) {
  return (
    <div className="rounded-md border bg-card w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Exercise Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Equipment</TableHead>
            <TableHead>Sets x Reps</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exercises.map((exercise) => (
            <TableRow key={exercise.id}>
              <TableCell className="font-medium">{exercise.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{exercise.category}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={
                  exercise.difficulty === 'Beginner' ? "bg-emerald-500/15 text-emerald-600" :
                  exercise.difficulty === 'Intermediate' ? "bg-amber-500/15 text-amber-600" :
                  "bg-rose-500/15 text-rose-600"
                }>
                  {exercise.difficulty}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{exercise.equipment || "Bodyweight"}</TableCell>
              <TableCell className="text-muted-foreground">
                {exercise.default_sets} x {exercise.default_reps}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(exercise)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this exercise?")) {
                      onDelete(exercise.id);
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
