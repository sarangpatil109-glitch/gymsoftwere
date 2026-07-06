import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lead } from "@/types/crm";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  lead: Lead;
  isOverlay?: boolean;
}

export function KanbanCard({ lead, isOverlay }: Props) {
  const router = useRouter();
  
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: "Lead",
      lead,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 border-2 border-primary border-dashed rounded-lg h-[120px] bg-background"
      />
    );
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if we aren't dragging and didn't click an action button
    if (e.defaultPrevented) return;
    router.push(`/crm/lead/${lead.id}`);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group ${isOverlay ? "shadow-xl ring-2 ring-primary rotate-2" : ""}`}
      onClick={handleCardClick}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={lead.photoUrl} alt={lead.fullName} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {getInitials(lead.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm line-clamp-1">{lead.fullName}</span>
              <span className="text-xs text-muted-foreground line-clamp-1">{lead.leadSource || "Unknown Source"}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-col gap-1.5 mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate">
            <Phone className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{lead.mobile}</span>
          </div>
          {lead.fitnessGoal && (
            <div className="mt-1">
              <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                {lead.fitnessGoal}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
