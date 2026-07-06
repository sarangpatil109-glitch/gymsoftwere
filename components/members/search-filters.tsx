import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  membershipFilter: string;
  setMembershipFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  goalFilter: string;
  setGoalFilter: (val: string) => void;
}

export function SearchFilters({
  searchQuery,
  setSearchQuery,
  membershipFilter,
  setMembershipFilter,
  statusFilter,
  setStatusFilter,
  goalFilter,
  setGoalFilter,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by Name, Mobile, or Email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10"
        />
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Select value={membershipFilter} onValueChange={(val) => val && setMembershipFilter(val)}>
          <SelectTrigger className="w-[140px] h-10">
            <SelectValue placeholder="Membership" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Memberships</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Quarterly">Quarterly</SelectItem>
            <SelectItem value="Half Yearly">Half Yearly</SelectItem>
            <SelectItem value="Yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
          <SelectTrigger className="w-[120px] h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        <Select value={goalFilter} onValueChange={(val) => val && setGoalFilter(val)}>
          <SelectTrigger className="w-[140px] h-10">
            <SelectValue placeholder="Goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Goals</SelectItem>
            <SelectItem value="Weight Loss">Weight Loss</SelectItem>
            <SelectItem value="Weight Gain">Weight Gain</SelectItem>
            <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
            <SelectItem value="Fitness">Fitness</SelectItem>
            <SelectItem value="Bodybuilding">Bodybuilding</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
