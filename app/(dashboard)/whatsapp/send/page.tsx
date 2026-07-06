"use client";

import { useState } from "react";
import { useWhatsAppTemplates, useSendWhatsAppMessage } from "@/hooks/useWhatsApp";
import { useMembers } from "@/hooks/useMembers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send } from "lucide-react";

export default function WhatsAppSendPage() {
  const { data: templates, isLoading: isLoadingTemplates } = useWhatsAppTemplates();
  const { data: members, isLoading: isLoadingMembers } = useMembers();
  const { mutate: sendMessage, isPending } = useSendWhatsAppMessage();

  const [selectedMember, setSelectedMember] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [variables, setVariables] = useState<Record<string, string>>({});

  if (isLoadingTemplates || isLoadingMembers) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  const activeTemplate = templates?.find(t => t.id === selectedTemplate);
  const activeMember = members?.find(m => m.id === selectedMember);

  const handleSend = () => {
    if (!activeMember || !activeTemplate) return;

    sendMessage({
      memberId: activeMember.id,
      phoneNumber: activeMember.mobileNumber,
      templateId: activeTemplate.id,
      variables: variables,
    }, {
      onSuccess: () => {
        setSelectedMember("");
        setSelectedTemplate("");
        setVariables({});
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b rounded-t-2xl">
          <CardTitle>Send Message</CardTitle>
          <CardDescription>Manually send a templated message to a member.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Member</label>
            <Select value={selectedMember} onValueChange={(val) => setSelectedMember(val || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Search or select a member..." />
              </SelectTrigger>
              <SelectContent>
                {members?.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.fullName} ({m.mobileNumber})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Template</label>
            <Select value={selectedTemplate} onValueChange={(val) => {
              setSelectedTemplate(val || "");
              setVariables({});
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select an approved template..." />
              </SelectTrigger>
              <SelectContent>
                {templates?.filter(t => t.status === 'APPROVED').map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activeTemplate && activeTemplate.variables && activeTemplate.variables.length > 0 && (
            <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border">
              <h4 className="text-sm font-medium mb-2">Template Variables</h4>
              {activeTemplate.variables.map((v, i) => (
                <div key={i} className="space-y-1">
                  <label className="text-xs text-slate-500">{v} ({`{{${i+1}}}`})</label>
                  <Input 
                    value={variables[(i+1).toString()] || ""}
                    onChange={(e) => setVariables(prev => ({ ...prev, [(i+1).toString()]: e.target.value }))}
                    placeholder={`Enter value for ${v}`}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTemplate && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl text-sm whitespace-pre-wrap font-mono">
              <strong>Preview:</strong><br/>
              {activeTemplate.content.replace(/{{(\d+)}}/g, (match, number) => {
                return variables[number] ? variables[number] : match;
              })}
            </div>
          )}

        </CardContent>
        <CardFooter className="p-6 border-t bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl flex justify-end gap-3">
          <Button variant="outline" onClick={() => {
            setSelectedMember("");
            setSelectedTemplate("");
          }}>Cancel</Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={handleSend}
            disabled={!selectedMember || !selectedTemplate || isPending}
          >
            {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Send Message
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
