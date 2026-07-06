"use client";

import { useState, useMemo } from "react";
import { useDietFoods, useDeleteDietFood } from "@/hooks/useDiet";
import { DietFoodTable } from "@/components/diet/diet-food-table";
import { DietFoodFormModal } from "@/components/diet/diet-food-form-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { useDebounce } from "@/hooks/useDebounce";
import { Plus, Apple, Search, Loader2 } from "lucide-react";
import { DietFood } from "@/types/fitness";

export default function DietPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<DietFood | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { data: foods = [], isLoading } = useDietFoods();
  const deleteFood = useDeleteDietFood();

  const handleEdit = (food: DietFood) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setSelectedFood(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteFood.mutate(id);
  };

  const filteredFoods = useMemo(() => {
    if (!debouncedSearch) return foods;
    const q = debouncedSearch.toLowerCase();
    return foods.filter(f => 
      f.food_name.toLowerCase().includes(q) ||
      f.meal_category.toLowerCase().includes(q)
    );
  }, [foods, debouncedSearch]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Diet Library</h2>
          <p className="text-muted-foreground mt-1">Manage food items and meals for diet plans.</p>
        </div>
        <Button onClick={handleOpenNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Food
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search foods or meals..." 
            className="pl-9 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-24 text-center border rounded-lg bg-card mt-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold">Loading diet library...</h3>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={Apple}
              title="No foods found"
              description="Your diet library is empty or no foods match your search."
              action={<Button onClick={handleOpenNew}>Add Food</Button>}
            />
          </div>
        ) : (
          <div className="mt-2">
            <DietFoodTable 
              foods={filteredFoods} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              isDeleting={deleteFood.isPending} 
            />
          </div>
        )}
      </div>

      <DietFoodFormModal 
        food={selectedFood}
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </div>
  );
}
