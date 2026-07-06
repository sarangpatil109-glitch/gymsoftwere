"use client";

import { useLeads, useFollowups, useTrials } from "@/hooks/useCRM";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Flame, PhoneCall, Calendar as CalendarIcon, CheckCircle2, TrendingUp, XCircle, DollarSign } from "lucide-react";
import { isToday } from "date-fns";

export default function CRMDashboardPage() {
  const { data: leads = [], isLoading: loadingLeads } = useLeads();
  const { data: followups = [], isLoading: loadingFollowups } = useFollowups();
  const { data: trials = [], isLoading: loadingTrials } = useTrials();

  const isLoading = loadingLeads || loadingFollowups || loadingTrials;

  if (isLoading) {
    return <div>Loading CRM Dashboard...</div>;
  }

  // Calculate Metrics
  const newLeads = leads.filter(l => l.stage === "New").length;
  const hotLeads = leads.filter(l => l.stage === "Interested" || l.stage === "Negotiation").length;
  
  const todaysFollowups = followups.filter(f => f.followupDate && isToday(new Date(f.followupDate))).length;
  const todaysTrials = trials.filter(t => t.trialDate && isToday(new Date(t.trialDate))).length;
  
  const convertedMembers = leads.filter(l => l.stage === "Joined").length;
  const lostLeads = leads.filter(l => l.stage === "Lost").length;
  
  const totalLeadsWithOutcomes = convertedMembers + lostLeads;
  const conversionRate = totalLeadsWithOutcomes > 0 
    ? Math.round((convertedMembers / totalLeadsWithOutcomes) * 100) 
    : 0;

  // Simple revenue calc based on converted members' budgets (in real app, this might link to actual memberships)
  const revenueGenerated = leads
    .filter(l => l.stage === "Joined")
    .reduce((sum, l) => sum + (Number(l.budget) || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Dashboard Overview</h3>
        <p className="text-sm text-muted-foreground">Snapshot of your sales pipeline and lead conversions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newLeads}</div>
            <p className="text-xs text-muted-foreground">Awaiting initial contact</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hotLeads}</div>
            <p className="text-xs text-muted-foreground">Interested or in negotiation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Follow-ups</CardTitle>
            <PhoneCall className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysFollowups}</div>
            <p className="text-xs text-muted-foreground">Calls scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Trials</CardTitle>
            <CalendarIcon className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysTrials}</div>
            <p className="text-xs text-muted-foreground">Trials scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converted Members</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{convertedMembers}</div>
            <p className="text-xs text-muted-foreground">Leads successfully joined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Of concluded leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lost Leads</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lostLeads}</div>
            <p className="text-xs text-muted-foreground">Declined or unresponsive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{revenueGenerated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From converted leads budgets</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
