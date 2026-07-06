"use client";

import { useState, useMemo } from "react";
import { Member } from "@/types/member";
import { useMembers } from "@/hooks/useMembers";
import { useCreateMember } from "@/hooks/useCreateMember";
import { useUpdateMember } from "@/hooks/useUpdateMember";
import { useDeleteMember } from "@/hooks/useDeleteMember";
import { useDebounce } from "@/hooks/useDebounce";
import { EmptyState } from "@/components/ui/empty-state";
import { SummaryCards } from "@/components/members/summary-cards";
import { SearchFilters } from "@/components/members/search-filters";
import { MembersTable } from "@/components/members/members-table";
import { MemberCard } from "@/components/members/member-card";
import { AddMemberModal, EditMemberModal } from "@/components/members/member-form-modal";
import { ViewMemberDrawer } from "@/components/members/view-member-drawer";
import { DeleteDialog } from "@/components/members/delete-dialog";
import { Button } from "@/components/ui/button";
import { Plus, FolderSearch, Loader2 } from "lucide-react";

export default function MembersPage() {
  const { data: members = [], isLoading } = useMembers();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [membershipFilter, setMembershipFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [goalFilter, setGoalFilter] = useState("All");

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Derived filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const q = debouncedSearchQuery.toLowerCase();
      const matchesSearch = 
        member.fullName.toLowerCase().includes(q) ||
        member.mobileNumber.includes(q) ||
        member.email.toLowerCase().includes(q);
      
      const matchesMembership = membershipFilter === "All" || member.membershipType === membershipFilter;
      const matchesStatus = statusFilter === "All" || member.status === statusFilter;
      const matchesGoal = goalFilter === "All" || member.goal === goalFilter;

      return matchesSearch && matchesMembership && matchesStatus && matchesGoal;
    });
  }, [members, debouncedSearchQuery, membershipFilter, statusFilter, goalFilter]);

  // Handlers
  const handleAddMember = async (newMember: Member) => {
    await createMember.mutateAsync(newMember);
  };

  const handleEditMember = async (updatedMember: Member) => {
    await updateMember.mutateAsync({ id: updatedMember.id, member: updatedMember });
    setIsEditOpen(false);
  };

  const handleDeleteMember = async () => {
    if (selectedMember) {
      await deleteMember.mutateAsync(selectedMember.id);
      setIsDeleteOpen(false);
      setSelectedMember(null);
    }
  };

  const openView = (member: Member) => {
    setSelectedMember(member);
    setIsViewOpen(true);
  };

  const openEdit = (member: Member) => {
    setSelectedMember(member);
    setIsEditOpen(true);
  };

  const openDelete = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Members</h2>
          <p className="text-muted-foreground mt-1">Manage all gym members from one place.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="w-full sm:w-auto shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </div>

      <SummaryCards members={members} />

      <div className="flex flex-col gap-4">
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          membershipFilter={membershipFilter}
          setMembershipFilter={setMembershipFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          goalFilter={goalFilter}
          setGoalFilter={setGoalFilter}
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-24 text-center border rounded-lg bg-card mt-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold">Loading members...</h3>
          </div>
        ) : filteredMembers.length === 0 ? (
          <EmptyState
            icon={FolderSearch}
            title="No members found"
            description="We couldn't find any members matching your current search and filter criteria."
            action={
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setMembershipFilter("All");
                setStatusFilter("All");
                setGoalFilter("All");
              }}>
                Clear Filters
              </Button>
            }
          />
        ) : (
          <div className="mt-2">
            <MembersTable members={filteredMembers} onView={openView} onEdit={openEdit} onDelete={openDelete} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {filteredMembers.map(member => (
                <MemberCard key={member.id} member={member} onView={openView} onEdit={openEdit} onDelete={openDelete} />
              ))}
            </div>
          </div>
        )}
      </div>

      <AddMemberModal open={isAddOpen} onOpenChange={setIsAddOpen} onSave={handleAddMember} />
      
      {selectedMember && (
        <EditMemberModal 
          open={isEditOpen} 
          onOpenChange={setIsEditOpen} 
          initialData={selectedMember} 
          onSave={handleEditMember} 
        />
      )}

      <ViewMemberDrawer 
        open={isViewOpen} 
        onOpenChange={setIsViewOpen} 
        member={selectedMember} 
      />

      <DeleteDialog 
        open={isDeleteOpen} 
        onOpenChange={setIsDeleteOpen} 
        onConfirm={handleDeleteMember}
        memberName={selectedMember?.fullName || ""}
      />
    </div>
  );
}
