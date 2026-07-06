"use client";

import { useFollowups, useTrials } from "@/hooks/useCRM";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isToday, isTomorrow, isThisWeek, parseISO } from "date-fns";
import { PhoneCall, Dumbbell, Calendar as CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CRMCalendarPage() {
  const { data: followups = [], isLoading: loadingF } = useFollowups();
  const { data: trials = [], isLoading: loadingT } = useTrials();

  if (loadingF || loadingT) {
    return <div>Loading Calendar...</div>;
  }

  // Filter out items without dates and sort
  const allFollowups = followups
    .filter(f => f.followupDate)
    .sort((a, b) => new Date(a.followupDate!).getTime() - new Date(b.followupDate!).getTime());
    
  const allTrials = trials
    .filter(t => t.trialDate)
    .sort((a, b) => new Date(a.trialDate!).getTime() - new Date(b.trialDate!).getTime());

  // Grouping
  const getGroup = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isThisWeek(date)) return "This Week";
    return "Later";
  };

  const groupedEvents = {
    "Today": { followups: [] as typeof followups, trials: [] as typeof trials },
    "Tomorrow": { followups: [] as typeof followups, trials: [] as typeof trials },
    "This Week": { followups: [] as typeof followups, trials: [] as typeof trials },
    "Later": { followups: [] as typeof followups, trials: [] as typeof trials },
  };

  allFollowups.forEach(f => {
    groupedEvents[getGroup(f.followupDate!) as keyof typeof groupedEvents].followups.push(f);
  });

  allTrials.forEach(t => {
    groupedEvents[getGroup(t.trialDate!) as keyof typeof groupedEvents].trials.push(t);
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h3 className="text-lg font-medium">Follow-ups & Trials Calendar</h3>
        <p className="text-sm text-muted-foreground">Manage your scheduled calls and trial sessions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(groupedEvents) as Array<keyof typeof groupedEvents>).map((group) => (
          <Card key={group} className="flex flex-col h-full bg-muted/20">
            <CardHeader className="pb-3 border-b bg-muted/40">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{group}</span>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 flex-1 overflow-y-auto space-y-3">
              {groupedEvents[group].followups.length === 0 && groupedEvents[group].trials.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No events scheduled.</p>
              ) : (
                <>
                  {/* Trials First */}
                  {groupedEvents[group].trials.map(trial => (
                    <div key={`trial-${trial.id}`} className="bg-background border rounded-md p-3 text-sm shadow-sm space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-primary flex items-center gap-1.5">
                          <Dumbbell className="h-3 w-3" /> Trial
                        </div>
                        <Badge variant="outline" className="text-[10px] h-4">{trial.status}</Badge>
                      </div>
                      <div className="font-medium line-clamp-1">{trial.lead?.fullName}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(parseISO(trial.trialDate!), "MMM d")} {trial.time && `• ${trial.time}`}
                      </div>
                    </div>
                  ))}

                  {/* Followups Second */}
                  {groupedEvents[group].followups.map(followup => (
                    <div key={`followup-${followup.id}`} className="bg-background border rounded-md p-3 text-sm shadow-sm space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-amber-600 flex items-center gap-1.5">
                          <PhoneCall className="h-3 w-3" /> Call
                        </div>
                        <Badge variant="outline" className="text-[10px] h-4">{followup.status}</Badge>
                      </div>
                      <div className="font-medium line-clamp-1">{followup.lead?.fullName}</div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{format(parseISO(followup.followupDate!), "MMM d")} {followup.time && `• ${followup.time}`}</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
