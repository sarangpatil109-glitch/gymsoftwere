"use client";

import { useState, useEffect } from "react";
import { useTrainers, useAssignedMembers, useTrainerDashboardStats } from "@/hooks/useTrainerPanel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, Dumbbell, Apple, AlertCircle, Loader2 } from "lucide-react";
import { AssignedMembersTable } from "@/components/trainer-panel/assigned-members-table";
import { Badge } from "@/components/ui/badge";

export default function TrainerPanelPage() {
  const { data: trainers, isLoading: isLoadingTrainers } = useTrainers();
  const [activeTrainerId, setActiveTrainerId] = useState<string>("");

  useEffect(() => {
    if (trainers && trainers.length > 0 && !activeTrainerId) {
      setActiveTrainerId(trainers[0].id);
    }
  }, [trainers, activeTrainerId]);

  const { data: stats, isLoading: isLoadingStats } = useTrainerDashboardStats(activeTrainerId);
  const { data: assignments, isLoading: isLoadingAssignments } = useAssignedMembers(activeTrainerId);

  if (isLoadingTrainers) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!trainers || trainers.length === 0) {
    return (
      <div className="p-8 text-center border rounded-xl bg-muted/10">
        <h2 className="text-lg font-semibold mb-2">No Trainers Found</h2>
        <p className="text-muted-foreground">Please add a trainer in the Settings module first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trainer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your clients, workouts, and diet plans.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-lg border">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap pl-2">Viewing As:</span>
          <Select value={activeTrainerId} onValueChange={(val) => setActiveTrainerId(val as string)}>
            <SelectTrigger className="w-[200px] bg-background">
              <SelectValue placeholder="Select Trainer" />
            </SelectTrigger>
            <SelectContent>
              {trainers.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assigned Members</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStats ? "-" : stats?.assignedMembers || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Attendance</CardTitle>
            <CalendarCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStats ? "-" : stats?.todaysAttendance || 0}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStats ? "-" : stats?.pendingWorkouts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Clients needing a plan</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Diets</CardTitle>
            <Apple className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStats ? "-" : stats?.pendingDietPlans || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Clients needing a plan</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">My Clients</h2>
          {isLoadingAssignments ? (
            <div className="flex justify-center p-8 border rounded-xl bg-card"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <AssignedMembersTable assignments={assignments || []} />
          )}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Alerts & Tasks</h2>
          <Card className="border-border shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y">
                
                {/* Pending Tasks Section */}
                <div className="p-4 space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Today's Tasks</h3>
                  {stats?.pendingWorkouts === 0 && stats?.pendingDietPlans === 0 ? (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-green-500" /> All clients have active plans.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {(stats?.pendingWorkouts || 0) > 0 && (
                        <div className="flex items-center justify-between bg-amber-500/10 text-amber-600 dark:text-amber-500 p-2 rounded-lg text-sm font-medium">
                          <span className="flex items-center gap-2"><Dumbbell className="h-4 w-4" /> Create Workouts</span>
                          <Badge variant="outline" className="bg-background border-amber-500/20">{stats?.pendingWorkouts}</Badge>
                        </div>
                      )}
                      {(stats?.pendingDietPlans || 0) > 0 && (
                        <div className="flex items-center justify-between bg-rose-500/10 text-rose-600 dark:text-rose-500 p-2 rounded-lg text-sm font-medium">
                          <span className="flex items-center gap-2"><Apple className="h-4 w-4" /> Create Diet Plans</span>
                          <Badge variant="outline" className="bg-background border-rose-500/20">{stats?.pendingDietPlans}</Badge>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Expiring Members (Mocked for UI as per requirement, or we can use real data if fetched) */}
                <div className="p-4 space-y-3 bg-muted/10">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending Reviews</h3>
                  <p className="text-sm text-muted-foreground">Check client transformation photos and adjust plans accordingly.</p>
                  <div className="flex items-center gap-2 text-sm text-primary cursor-pointer hover:underline">
                    View Progress Logs &rarr;
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
