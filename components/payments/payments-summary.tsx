import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { PaymentStats } from "@/types/payment";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentsSummaryProps {
  stats?: PaymentStats;
  isLoading: boolean;
}

export function PaymentsSummary({ stats, isLoading }: PaymentsSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today&apos;s Collection</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">₹{stats?.todayRevenue?.toLocaleString() || 0}</div>}
          <p className="text-xs text-muted-foreground mt-1">Cash & Online</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Collection</CardTitle>
          <IndianRupee className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">₹{stats?.monthlyRevenue?.toLocaleString() || 0}</div>}
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
          <AlertCircle className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">₹{stats?.pendingAmount?.toLocaleString() || 0}</div>}
          <p className="text-xs text-muted-foreground mt-1">From active members</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">₹{stats?.totalRevenue?.toLocaleString() || 0}</div>}
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </CardContent>
      </Card>
    </div>
  );
}
