import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  trendDirection: "up" | "down" | "neutral";
}

export function StatCard({ title, value, icon: Icon, trend, trendDirection }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn(
          "text-xs mt-1",
          trendDirection === "up" ? "text-emerald-500" : 
          trendDirection === "down" ? "text-rose-500" : "text-muted-foreground"
        )}>
          {trend}
        </p>
      </CardContent>
    </Card>
  );
}
