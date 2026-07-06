import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AttendanceWithMember } from "@/types/attendance";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AttendanceTableProps {
  attendances: AttendanceWithMember[];
  onCheckOut: (id: string) => void;
  isCheckingOut: boolean;
}

export function AttendanceTable({ attendances, onCheckOut, isCheckingOut }: AttendanceTableProps) {
  return (
    <div className="rounded-md border bg-card w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Membership</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={record.member.photoUrl} alt={record.member.fullName} />
                    <AvatarFallback>{record.member.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{record.member.fullName}</span>
                    <span className="text-xs text-muted-foreground">{record.member.memberId || "No ID"}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{record.member.membershipType}</Badge>
              </TableCell>
              <TableCell>
                {format(new Date(record.attendanceDate), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(record.checkInTime), "hh:mm a")}
              </TableCell>
              <TableCell>
                {record.checkOutTime ? (
                  format(new Date(record.checkOutTime), "hh:mm a")
                ) : (
                  <span className="text-muted-foreground text-sm">--:--</span>
                )}
              </TableCell>
              <TableCell>
                <Badge className={
                  record.status === 'Present' ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25" :
                  record.status === 'Late' ? "bg-amber-500/15 text-amber-600 hover:bg-amber-500/25" :
                  "bg-rose-500/15 text-rose-600 hover:bg-rose-500/25"
                }>
                  {record.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{record.source}</span>
              </TableCell>
              <TableCell className="text-right">
                {!record.checkOutTime ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onCheckOut(record.id)}
                    disabled={isCheckingOut}
                  >
                    Check Out
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground italic">Checked Out</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
