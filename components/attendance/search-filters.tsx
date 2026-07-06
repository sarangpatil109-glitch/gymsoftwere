import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  dateFilter: string;
  setDateFilter: (val: string) => void;
}

export function SearchFilters({
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search name, ID, phone..."
          className="pl-8 bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto">
        <Select value={dateFilter} onValueChange={(val) => val && setDateFilter(val)}>
          <SelectTrigger className="w-full sm:w-[160px] h-10">
            <SelectValue placeholder="Date Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="last7days">Last 7 Days</SelectItem>
            <SelectItem value="last30days">Last 30 Days</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
