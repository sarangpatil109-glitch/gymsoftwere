"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useLead, useUpdateLeadStage, useLeadNotes, useFollowups, useTrials } from "@/hooks/useCRM";
import { useCreateMember } from "@/hooks/useCreateMember";
import { dispatchAutomationEvent } from "@/services/automation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, MapPin, Briefcase, User, Calendar as CalendarIcon, ArrowLeft, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AddMemberModal } from "@/components/members/member-form-modal";
import { Member } from "@/types/member";
import { Lead } from "@/types/crm";

export default function LeadProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const { data: lead, isLoading } = useLead(resolvedParams.id);
  const updateStage = useUpdateLeadStage();
  const createMember = useCreateMember();
  
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);

  if (isLoading || !lead) {
    return <div>Loading Profile...</div>;
  }

  const handleConvert = async (memberData: Member) => {
    try {
      // 1. Create the member
      const newMember = await createMember.mutateAsync(memberData);
      
      // 2. Update Lead Stage to Joined
      await updateStage.mutateAsync({ id: lead.id, stage: "Joined" });
      
      // 3. Dispatch Event
      dispatchAutomationEvent("LEAD_CONVERTED", { memberId: newMember.id });
      
      setIsConvertModalOpen(false);
      router.push(`/members`); // Navigate to members list after conversion
    } catch (error) {
      console.error("Failed to convert lead", error);
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Prefill Data Mapper
  const prefillMemberData: Partial<Member> = {
    fullName: lead.fullName,
    mobileNumber: lead.mobile,
    whatsappNumber: lead.whatsapp || lead.mobile,
    email: lead.email || "",
    gender: lead.gender as any,
    address: lead.address,
    medicalConditions: lead.medicalConditions,
    notes: lead.notes,
    goal: lead.fitnessGoal as any,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h3 className="text-xl font-bold">{lead.fullName}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Badge variant="outline">{lead.stage}</Badge>
              Created {lead.createdAt && format(new Date(lead.createdAt), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        
        {lead.stage !== "Joined" && (
          <Button onClick={() => setIsConvertModalOpen(true)} className="bg-green-600 hover:bg-green-700">
            <RefreshCw className="mr-2 h-4 w-4" /> Convert to Member
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={lead.photoUrl} alt={lead.fullName} />
                  <AvatarFallback className="text-xl">{getInitials(lead.fullName)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{lead.fullName}</h4>
                  <p className="text-sm text-muted-foreground">{lead.leadSource || "Unknown Source"}</p>
                </div>
              </div>

              <div className="space-y-3 mt-4 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.mobile}</span>
                </div>
                {lead.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.email}</span>
                  </div>
                )}
                {lead.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.address}</span>
                  </div>
                )}
                {lead.occupation && (
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.occupation}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Fitness Goal</p>
                <p className="text-sm font-medium">{lead.fitnessGoal || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Budget</p>
                <p className="text-sm font-medium">{lead.budget ? `₹${lead.budget}` : "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Preferred Batch</p>
                <p className="text-sm font-medium">{lead.preferredBatch || "Not specified"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle/Right Column: Activity & Timeline */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Medical & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lead.medicalConditions && (
                <div className="p-3 bg-red-50 text-red-900 rounded-md text-sm border border-red-100">
                  <span className="font-semibold block mb-1">Medical Conditions:</span>
                  {lead.medicalConditions}
                </div>
              )}
              {lead.notes && (
                <div className="p-3 bg-muted rounded-md text-sm">
                  <span className="font-semibold block mb-1">General Notes:</span>
                  {lead.notes}
                </div>
              )}
              {!lead.medicalConditions && !lead.notes && (
                <p className="text-sm text-muted-foreground italic">No additional notes.</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">Timeline events (Trials, Follow-ups) will appear here.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddMemberModal 
        open={isConvertModalOpen} 
        onOpenChange={setIsConvertModalOpen} 
        prefillData={prefillMemberData}
        onSave={handleConvert} 
      />
    </div>
  );
}
