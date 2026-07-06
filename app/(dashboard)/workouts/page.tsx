"use client";

import { useState, useMemo } from "react";
import { useExercises, useDeleteExercise } from "@/hooks/useWorkout";
import { ExerciseTable } from "@/components/workouts/exercise-table";
import { ExerciseFormModal } from "@/components/workouts/exercise-form-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { useDebounce } from "@/hooks/useDebounce";
import { Plus, Dumbbell, Search, Loader2 } from "lucide-react";
import { Exercise } from "@/types/fitness";

export default function WorkoutsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { data: exercises = [], isLoading } = useExercises();
  const deleteExercise = useDeleteExercise();

  const handleEdit = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setSelectedExercise(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteExercise.mutate(id);
  };

  const filteredExercises = useMemo(() => {
    if (!debouncedSearch) return exercises;
    const q = debouncedSearch.toLowerCase();
    return exercises.filter(ex => 
      ex.name.toLowerCase().includes(q) ||
      ex.category.toLowerCase().includes(q) ||
      (ex.equipment && ex.equipment.toLowerCase().includes(q))
    );
  }, [exercises, debouncedSearch]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workout Library</h2>
          <p className="text-muted-foreground mt-1">Manage exercises and templates for your members.</p>
        </div>
        <Button onClick={handleOpenNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Exercise
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search exercises..." 
            className="pl-9 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-24 text-center border rounded-lg bg-card mt-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold">Loading library...</h3>
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={Dumbbell}
              title="No exercises found"
              description="Your workout library is empty or no exercises match your search."
              action={<Button onClick={handleOpenNew}>Add Exercise</Button>}
            />
          </div>
        ) : (
          <div className="mt-2">
            <ExerciseTable 
              exercises={filteredExercises} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              isDeleting={deleteExercise.isPending} 
            />
          </div>
        )}
      </div>

      <ExerciseFormModal 
        exercise={selectedExercise}
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </div>
  );
}
