import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, CalendarCheck, CreditCard, FileText } from "lucide-react";
import Link from "next/link";

const actions = [
  { name: "Add Member", href: "/members", icon: UserPlus },
  { name: "Take Attendance", href: "/attendance", icon: CalendarCheck },
  { name: "Receive Payment", href: "/payments", icon: CreditCard },
  { name: "View Reports", href: "/reports", icon: FileText },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {actions.map((action) => (
          <Link key={action.name} href={action.href} className="w-full h-full block">
            <Button variant="outline" className="h-24 w-full flex-col gap-2">
              <action.icon className="h-6 w-6 text-primary" />
              <span>{action.name}</span>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
