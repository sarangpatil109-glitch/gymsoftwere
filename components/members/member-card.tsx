import { Member } from "@/types/member";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Phone } from "lucide-react";
import { MemberWebsiteCell } from "./member-website-cell";

interface MemberCardProps {
  member: Member;
  onView: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}

export function MemberCard({ member, onView, onEdit, onDelete }: MemberCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Expired": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "Pending": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default: return "";
    }
  };

  return (
    <Card className="lg:hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.photoUrl} alt={member.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                {member.fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-base">{member.fullName}</h3>
              <p className="text-xs text-muted-foreground">{member.id} • {member.age} yrs</p>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(member.status)}>
            {member.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3"/> Mobile</span>
            <span>{member.mobileNumber}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Membership</span>
            <span className="font-medium">{member.membershipType}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Joining Date</span>
            <span>{member.joiningDate}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Expiry Date</span>
            <span>{member.expiryDate}</span>
          </div>
        </div>

        <div className="mb-4 pt-2 border-t">
          <MemberWebsiteCell member={member} />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t">
          <Button variant="outline" size="sm" onClick={() => onView(member)} className="flex-1 text-muted-foreground">
            <Eye className="h-4 w-4 mr-2" /> View
          </Button>
          <Button variant="outline" size="icon" onClick={() => onEdit(member)} className="text-muted-foreground">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onDelete(member)} className="text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
