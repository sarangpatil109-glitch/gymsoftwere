"use client";

import { useState } from "react";
import { RevenueTrendChart, MemberGrowthChart, DailyAttendanceChart, MembershipDistributionChart, PaymentMethodChart } from "@/components/reports/charts";
import { RevenueReportView } from "@/components/reports/revenue-report";
import { MembershipReportView } from "@/components/reports/membership-report";
import { AttendanceReportView } from "@/components/reports/attendance-report";
import { MemberGrowthReportView } from "@/components/reports/member-growth-report";
import { TrainerReportView } from "@/components/reports/trainer-report";
import { AnalyticsCards as AnalyticsSummaryCards } from "@/components/reports/analytics-cards";
import { Button } from "@/components/ui/button";

type ReportTab = 'dashboard' | 'revenue' | 'membership' | 'attendance' | 'growth' | 'trainers';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('dashboard');

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2 border-b">
        <Button 
          variant={activeTab === 'dashboard' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('dashboard')}
          className="rounded-full"
        >
          Dashboard
        </Button>
        <Button 
          variant={activeTab === 'revenue' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('revenue')}
          className="rounded-full"
        >
          Revenue
        </Button>
        <Button 
          variant={activeTab === 'membership' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('membership')}
          className="rounded-full"
        >
          Memberships
        </Button>
        <Button 
          variant={activeTab === 'attendance' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('attendance')}
          className="rounded-full"
        >
          Attendance
        </Button>
        <Button 
          variant={activeTab === 'growth' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('growth')}
          className="rounded-full"
        >
          Member Growth
        </Button>
        <Button 
          variant={activeTab === 'trainers' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('trainers')}
          className="rounded-full"
        >
          Trainers
        </Button>
      </div>

      <div className="mt-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <AnalyticsSummaryCards />
            
            <div className="grid gap-4 md:grid-cols-2">
              <RevenueTrendChart />
              <MemberGrowthChart />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <DailyAttendanceChart />
              <MembershipDistributionChart />
              <PaymentMethodChart />
            </div>
          </div>
        )}

        {activeTab === 'revenue' && <RevenueReportView />}
        {activeTab === 'membership' && <MembershipReportView />}
        {activeTab === 'attendance' && <AttendanceReportView />}
        {activeTab === 'growth' && <MemberGrowthReportView />}
        {activeTab === 'trainers' && <TrainerReportView />}
      </div>
    </div>
  );
}
