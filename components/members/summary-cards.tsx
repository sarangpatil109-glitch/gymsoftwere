import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, AlertCircle, UserPlus } from "lucide-react";
import { Member } from "@/types/member";
import { isThisMonth, parseISO } from "date-fns";

interface SummaryCardsProps {
  members: Member[];
}

export function SummaryCards({ members }: SummaryCardsProps) {
  const total = members.length;
  const active = members.filter(m => m.status === "Active").length;
  const expiringSoon = members.filter(m => m.status === "Pending" || m.status === "Expired").length; // Approximation for demo
  const newThisMonth = members.filter(m => isThisMonth(parseISO(m.joiningDate))).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
            <UserCheck className="h-5 w-5 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{active}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{expiringSoon}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
            <UserPlus className="h-5 w-5 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{newThisMonth}</div>
        </CardContent>
      </Card>
    </div>
  );
}
