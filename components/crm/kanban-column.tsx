import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "./kanban-card";
import { Lead } from "@/types/crm";
import { Badge } from "@/components/ui/badge";

interface Props {
  column: {
    id: string;
    title: string;
  };
  leads: Lead[];
}

export function KanbanColumn({ column, leads }: Props) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col bg-muted/40 rounded-xl w-[300px] flex-shrink-0"
    >
      <div className="p-4 font-semibold text-sm flex items-center justify-between border-b">
        <span>{column.title}</span>
        <Badge variant="secondary" className="bg-background">{leads.length}</Badge>
      </div>

      <div className="flex flex-col gap-3 p-3 flex-1 overflow-y-auto min-h-[150px]">
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map(lead => (
            <KanbanCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
