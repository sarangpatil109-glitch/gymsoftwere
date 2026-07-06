import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, UserMinus, Percent } from "lucide-react";
import { AttendanceStats } from "@/types/attendance";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryCardsProps {
  stats?: AttendanceStats;
  isLoading: boolean;
}

export function SummaryCards({ stats, isLoading }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          <UserCheck className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{stats?.present || 0}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">Checked-in members</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
          <UserMinus className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{stats?.absent || 0}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">Yet to check in</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance %</CardTitle>
          <Percent className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{stats?.percentage || 0}%</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">Of total active members</p>
        </CardContent>
      </Card>
    </div>
  );
}
