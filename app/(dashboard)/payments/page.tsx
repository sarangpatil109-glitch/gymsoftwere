"use client";

import { useState, useMemo } from "react";
import { usePayments, usePaymentStats } from "@/hooks/usePayments";
import { PaymentsSummary } from "@/components/payments/payments-summary";
import { PaymentsTable } from "@/components/payments/payments-table";
import { SearchFilters } from "@/components/attendance/search-filters"; // reuse UI
import { useDebounce } from "@/hooks/useDebounce";
import { EmptyState } from "@/components/ui/empty-state";
import { CreditCard, Loader2 } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  
  const { data: stats, isLoading: isLoadingStats } = usePaymentStats();
  const { data: payments = [], isLoading: isLoadingPayments } = usePayments();
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Client-side filtering
  const filteredPayments = useMemo(() => {
    let filtered = payments;

    // Search Filter
    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.member.fullName.toLowerCase().includes(q) ||
        (p.member.memberId && p.member.memberId.toLowerCase().includes(q)) ||
        p.receiptNumber.toLowerCase().includes(q) ||
        p.member.mobileNumber.includes(q)
      );
    }

    // Date Filter
    const today = startOfDay(new Date());
    if (dateFilter === "today") {
      filtered = filtered.filter(p => format(new Date(p.paymentDate), "yyyy-MM-dd") === format(today, "yyyy-MM-dd"));
    } else if (dateFilter === "yesterday") {
      const yesterday = format(subDays(today, 1), "yyyy-MM-dd");
      filtered = filtered.filter(p => format(new Date(p.paymentDate), "yyyy-MM-dd") === yesterday);
    } else if (dateFilter === "last7days") {
      const last7 = startOfDay(subDays(today, 7));
      filtered = filtered.filter(p => new Date(p.paymentDate) >= last7);
    } else if (dateFilter === "last30days") {
      const last30 = startOfDay(subDays(today, 30));
      filtered = filtered.filter(p => new Date(p.paymentDate) >= last30);
    }

    return filtered;
  }, [payments, debouncedSearchQuery, dateFilter]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground mt-1">Manage gym payments and memberships.</p>
        </div>
        {/* We can have a direct "Receive Payment" button but it needs a selected member and membership. 
            For now, it's driven from the Member Profile. But we can just direct users to Members page. */}
      </div>

      <PaymentsSummary stats={stats} isLoading={isLoadingStats} />

      <div className="flex flex-col gap-4">
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
        
        {isLoadingPayments ? (
          <div className="flex flex-col items-center justify-center p-24 text-center border rounded-lg bg-card mt-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold">Loading payments...</h3>
          </div>
        ) : filteredPayments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payments found"
            description="We couldn't find any transactions matching your filters."
          />
        ) : (
          <div className="mt-2">
            <PaymentsTable payments={filteredPayments} />
          </div>
        )}
      </div>
    </div>
  );
}
