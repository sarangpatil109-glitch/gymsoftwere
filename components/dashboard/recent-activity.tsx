import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const activityData: { id: number; name: string; action: string; time: string; status: BadgeVariant; initial: string }[] = [
  { id: 1, name: "Liam Johnson", action: "Paid Membership", time: "2 hours ago", status: "default", initial: "LJ" },
  { id: 2, name: "Emma Williams", action: "Checked In", time: "3 hours ago", status: "default", initial: "EW" },
  { id: 3, name: "Noah Brown", action: "New Member", time: "5 hours ago", status: "secondary", initial: "NB" },
  { id: 4, name: "Olivia Davis", action: "Missed Payment", time: "1 day ago", status: "destructive", initial: "OD" },
  { id: 5, name: "William Miller", action: "Checked In", time: "1 day ago", status: "default", initial: "WM" },
];

export function RecentActivity() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityData.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback>{activity.initial}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{activity.name}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={activity.status}>{activity.action}</Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{activity.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
