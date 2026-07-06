"use client";

import { useMemo, useState } from "react";
import { Lead, LeadStage } from "@/types/crm";
import { useLeads, useUpdateLeadStage } from "@/hooks/useCRM";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";

const STAGES: LeadStage[] = [
  "New", 
  "Contacted", 
  "Interested", 
  "Trial Scheduled", 
  "Trial Completed", 
  "Negotiation", 
  "Joined", 
  "Lost"
];

export function KanbanBoard() {
  const { data: leadsData = [], isLoading } = useLeads();
  const updateStage = useUpdateLeadStage();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  // Sync leads when data changes, but we manage local state for smooth drag drop
  useMemo(() => {
    setLeads(leadsData);
  }, [leadsData]);

  const columns = useMemo(() => STAGES.map(stage => ({ id: stage, title: stage })), []);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (isLoading) {
    return <div>Loading Kanban Board...</div>;
  }

  function onDragStart(event: DragStartEvent) {
    const { active } = event;
    const lead = leads.find((l) => l.id === active.id);
    if (lead) setActiveLead(lead);
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveALead = active.data.current?.type === "Lead";
    const isOverALead = over.data.current?.type === "Lead";
    const isOverAColumn = over.data.current?.type === "Column";

    if (!isActiveALead) return;

    // Dropping a Lead over another Lead
    if (isActiveALead && isOverALead) {
      setLeads((leads) => {
        const activeIndex = leads.findIndex((l) => l.id === activeId);
        const overIndex = leads.findIndex((l) => l.id === overId);

        if (leads[activeIndex].stage !== leads[overIndex].stage) {
          leads[activeIndex].stage = leads[overIndex].stage;
          return arrayMove(leads, activeIndex, overIndex);
        }

        return arrayMove(leads, activeIndex, overIndex);
      });
    }

    // Dropping a Lead over a Column
    if (isActiveALead && isOverAColumn) {
      setLeads((leads) => {
        const activeIndex = leads.findIndex((l) => l.id === activeId);
        leads[activeIndex].stage = overId as LeadStage;
        return arrayMove(leads, activeIndex, activeIndex);
      });
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      const originalLead = leadsData.find((l) => l.id === leadId);
      if (originalLead && originalLead.stage !== lead.stage) {
        updateStage.mutate({ id: leadId, stage: lead.stage });
      }
    }
  }

  return (
    <div className="flex h-full w-full overflow-x-auto pb-4 pt-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-4">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              leads={leads.filter((lead) => lead.stage === col.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeLead ? <KanbanCard lead={activeLead} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
