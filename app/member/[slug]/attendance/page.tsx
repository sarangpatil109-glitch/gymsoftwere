"use client";

import { use } from "react";
import { usePortalMemberBySlug } from "@/hooks/useMemberPortal";
import { useMemberAttendanceHistory } from "@/hooks/useAttendance";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CalendarCheck, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function MemberAttendancePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: member, isLoading: isLoadingMember } = usePortalMemberBySlug(slug);
  const { data: history, isLoading: isLoadingHistory } = useMemberAttendanceHistory(member?.id || "");

  if (isLoadingMember || isLoadingHistory) {
    return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  if (!member) return <div className="text-center p-10">Member not found</div>;

  // Calculate some basic stats
  const totalVisits = history?.filter(h => h.status === 'Present').length || 0;
  
  // Group by month for a nicer display (optional, but a flat list is also fine. We'll stick to a flat list for simplicity)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance History</h1>
          <p className="text-slate-500 mt-1">Review your gym check-ins and consistency.</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-xl font-medium border border-blue-100 dark:border-blue-900/50">
          Total Visits: <span className="font-bold">{totalVisits}</span>
        </div>
      </div>

      <Card className="rounded-2xl border-0 shadow-sm">
        <CardContent className="p-0">
          {!history || history.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <CalendarCheck className="h-12 w-12 text-slate-300 mb-4" />
              <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No Attendance Records</h2>
              <p className="mt-2 text-sm">Your check-ins will appear here once you start visiting.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.map(record => (
                <div key={record.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <CalendarCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {format(parseISO(record.attendanceDate), 'EEEE, MMMM dd, yyyy')}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                        {record.checkInTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> 
                            In: {format(parseISO(record.checkInTime), 'h:mm a')}
                          </span>
                        )}
                        {record.checkOutTime && (
                          <span className="flex items-center gap-1 before:content-['•'] before:mx-1 before:text-slate-300">
                            Out: {format(parseISO(record.checkOutTime), 'h:mm a')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant={record.status === 'Present' ? 'default' : 'secondary'} className={record.status === 'Present' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}>
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
