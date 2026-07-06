"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RevenueChart } from "@/components/dashboard/charts/revenue-chart";
import { MembersChart } from "@/components/dashboard/charts/members-chart";
import { Users, UserCheck, IndianRupee, AlertCircle } from "lucide-react";
import { useAttendanceStats } from "@/hooks/useAttendance";
import { usePaymentStats } from "@/hooks/usePayments";
import { useExpiringMemberships } from "@/hooks/useMemberships";
import { useGymProfile } from "@/hooks/useSettings";

import { ExpiringMembershipsWidget } from "@/components/dashboard/widgets/ExpiringMembershipsWidget";
import { PendingPaymentsWidget } from "@/components/dashboard/widgets/PendingPaymentsWidget";
import { BirthdaysWidget } from "@/components/dashboard/widgets/BirthdaysWidget";
import { NewMembersWidget } from "@/components/dashboard/widgets/NewMembersWidget";
import { MissingAttendanceWidget } from "@/components/dashboard/widgets/MissingAttendanceWidget";
import { LowStockWidget } from "@/components/dashboard/widgets/LowStockWidget";
import { TrainerScheduleWidget } from "@/components/dashboard/widgets/TrainerScheduleWidget";
import { UpcomingRenewalsWidget } from "@/components/dashboard/widgets/UpcomingRenewalsWidget";

export default function DashboardPage() {
  const { data: attendanceStats } = useAttendanceStats();
  const { data: paymentStats } = usePaymentStats();
  const { data: profile } = useGymProfile();
  const gymName = profile?.gymName || "GymOS";

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome to {gymName}</h2>
          <p className="text-sm text-muted-foreground mt-1">Here&apos;s what&apos;s happening at {gymName} today.</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value="150"
          icon={Users}
          trend="+12% from last month"
          trendDirection="up"
        />
        <StatCard
          title="Today's Attendance"
          value={attendanceStats?.present?.toString() || "0"}
          icon={UserCheck}
          trend={`${attendanceStats?.percentage || 0}% of members`}
          trendDirection="up"
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${paymentStats?.monthlyRevenue?.toLocaleString() || 0}`}
          icon={IndianRupee}
          trend={`Today: ₹${paymentStats?.todayRevenue?.toLocaleString() || 0}`}
          trendDirection="up"
        />
        <StatCard
          title="Pending Payments"
          value={`₹${paymentStats?.pendingAmount?.toLocaleString() || 0}`}
          icon={AlertCircle}
          trend="Review pending collections"
          trendDirection="down"
        />
      </div>

      <QuickActions />

      {/* Priority Action Widgets (Full Width on Mobile, Half on Desktop) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ExpiringMembershipsWidget />
        <PendingPaymentsWidget />
      </div>

      {/* Secondary Context Widgets (Masonry/Bento Box Style) */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <BirthdaysWidget />
          <NewMembersWidget />
        </div>
        <div className="flex flex-col gap-4">
          <MissingAttendanceWidget />
        </div>
        <div className="flex flex-col gap-4">
          <LowStockWidget />
        </div>
        <div className="flex flex-col gap-4">
          <TrainerScheduleWidget />
          <UpcomingRenewalsWidget />
        </div>
      </div>
      
      {/* Analytics Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <RevenueChart />
        <MembersChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <RecentActivity />
      </div>
    </div>
  );
}
