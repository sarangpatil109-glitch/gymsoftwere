import { Member } from "@/types/member";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { MemberWebsiteCell } from "./member-website-cell";

interface MembersTableProps {
  members: Member[];
  onView: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}

export function MembersTable({ members, onView, onEdit, onDelete }: MembersTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20";
      case "Expired": return "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20";
      case "Pending": return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20";
      default: return "";
    }
  };

  return (
    <div className="rounded-md border bg-card hidden lg:block w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Member</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Goal</TableHead>
            <TableHead>Membership</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="hover:bg-muted/50 transition-colors">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.photoUrl} alt={member.fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {member.fullName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{member.fullName}</span>
                    <span className="text-xs text-muted-foreground">{member.id} • {member.age} yrs</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col text-sm">
                  <span>{member.mobileNumber}</span>
                  <span className="text-xs text-muted-foreground">{member.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <MemberWebsiteCell member={member} />
              </TableCell>
              <TableCell>
                <span className="text-sm">{member.goal}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{member.membershipType}</span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col text-sm">
                  <span className="text-muted-foreground text-xs">Join: {member.joiningDate}</span>
                  <span>Exp: {member.expiryDate}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onView(member)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(member)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(member)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
