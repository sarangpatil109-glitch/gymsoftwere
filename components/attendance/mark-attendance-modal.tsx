import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMembers } from "@/hooks/useMembers";
import { useCheckIn } from "@/hooks/useCheckIn";
import { useState, useMemo } from "react";
import { Search, CheckCircle2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface MarkAttendanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarkAttendanceModal({ open, onOpenChange }: MarkAttendanceModalProps) {
  const { data: members = [], isLoading: isLoadingMembers } = useMembers();
  const checkIn = useCheckIn();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return members.filter((member) => 
      member.fullName.toLowerCase().includes(q) ||
      (member.memberId && member.memberId.toLowerCase().includes(q)) ||
      member.mobileNumber.includes(q)
    ).slice(0, 5); // Limit to top 5 results for speed
  }, [members, searchQuery]);

  // Safe wrapper to prevent closing on error if we want
  const onCheckInClick = (memberId: string) => {
    checkIn.mutate({ memberId, source: "Manual" }, {
      onSuccess: () => {
        onOpenChange(false);
        setSearchQuery("");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>
            Search for a member by Name, ID, or Phone to check them in manually.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search member..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          <ScrollArea className="h-[300px] rounded-md border p-4">
            {isLoadingMembers ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : searchQuery === "" ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-2">
                <CheckCircle2 className="h-8 w-8 opacity-20" />
                <p>Type to search members</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="flex justify-center items-center h-full text-muted-foreground">
                No members found.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.photoUrl} alt={member.fullName} />
                        <AvatarFallback>{member.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{member.fullName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{member.memberId || "No ID"}</span>
                          <Badge variant="secondary" className="text-[10px] h-4 px-1">{member.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => onCheckInClick(member.id)}
                      disabled={checkIn.isPending}
                    >
                      {checkIn.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check In"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
