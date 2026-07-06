"use client";

import { useState } from "react";
import { TrainerAssignment } from "@/types/trainer-panel";
import { Member } from "@/types/member";
import { Search, Eye, AlertCircle, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ViewMemberDrawer } from "@/components/members/view-member-drawer";

interface AssignedMembersTableProps {
  assignments: TrainerAssignment[];
}

export function AssignedMembersTable({ assignments }: AssignedMembersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const filtered = assignments.filter((a) => {
    const m = a.member;
    if (!m) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      m.fullName.toLowerCase().includes(searchLower) ||
      (m.email && m.email.toLowerCase().includes(searchLower)) ||
      (m.mobileNumber && m.mobileNumber.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search members..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Assigned Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-6 w-6 text-muted-foreground/50" />
                      <p>No assigned members found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((a) => {
                  const m = a.member!;
                  return (
                    <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {m.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{m.fullName}</div>
                            <div className="text-xs text-muted-foreground">ID: {m.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1 text-xs">
                          {m.mobileNumber && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {m.mobileNumber}</span>}
                          {m.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {m.email}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(a.assigned_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={m.status === 'Active' ? 'default' : 'secondary'} className="font-normal">
                          {m.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedMember(m)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ViewMemberDrawer 
        member={selectedMember} 
        open={!!selectedMember}
        onOpenChange={(open) => {
          if (!open) setSelectedMember(null);
        }} 
      />
    </div>
  );
}
