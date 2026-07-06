"use client";

import { ReportFilters } from "@/types/report";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useMembershipPlans } from "@/hooks/useMembershipPlans";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface ReportFilterBarProps {
  filters: ReportFilters;
  setFilters: (filters: ReportFilters) => void;
  showMembershipType?: boolean;
  showPaymentStatus?: boolean;
}

export function ReportFilterBar({ filters, setFilters, showMembershipType = false, showPaymentStatus = false }: ReportFilterBarProps) {
  const { data: plans } = useMembershipPlans();
  const [searchVal, setSearchVal] = useState(filters.searchQuery || '');
  const debouncedSearch = useDebounce(searchVal, 400);

  useEffect(() => {
    if (debouncedSearch !== filters.searchQuery) {
      setFilters({ ...filters, searchQuery: debouncedSearch });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    setFilters({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value ? new Date(value) : undefined
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center bg-card p-4 rounded-xl border mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name, phone..." 
          className="pl-9"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Input 
          type="date" 
          className="w-[140px]"
          value={filters.dateRange.from ? filters.dateRange.from.toISOString().split('T')[0] : ''}
          onChange={(e) => handleDateChange('from', e.target.value)}
        />
        <span className="text-muted-foreground text-sm">to</span>
        <Input 
          type="date" 
          className="w-[140px]"
          value={filters.dateRange.to ? filters.dateRange.to.toISOString().split('T')[0] : ''}
          onChange={(e) => handleDateChange('to', e.target.value)}
        />
      </div>

      {showMembershipType && (
        <Select 
          value={filters.membershipType || "ALL"} 
          onValueChange={(val: string | null) => {
            if (val) setFilters({ ...filters, membershipType: val === "ALL" ? undefined : val })
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Plans" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Plans</SelectItem>
            {plans?.map(plan => (
              <SelectItem key={plan.id} value={plan.planName}>{plan.planName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showPaymentStatus && (
        <Select 
          value={filters.paymentStatus || "ALL"} 
          onValueChange={(val: string | null) => {
            if (val) setFilters({ ...filters, paymentStatus: val === "ALL" ? undefined : val })
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Partial">Partial</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setFilters({ dateRange: {} })}
        title="Clear Filters"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
