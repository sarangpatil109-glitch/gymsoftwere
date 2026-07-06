"use client";

import { KanbanBoard } from "@/components/crm/kanban-board";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CRMBoardPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Sales Pipeline</h3>
          <p className="text-sm text-muted-foreground">Drag and drop leads to update their stage.</p>
        </div>
        <Button onClick={() => router.push("/crm/add")} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Lead
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  );
}
