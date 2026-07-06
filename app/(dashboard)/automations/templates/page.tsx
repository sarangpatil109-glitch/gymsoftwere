"use client";

import { useAutomationTemplates } from "@/hooks/useAutomations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileEdit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AutomationsTemplatesPage() {
  const { data: templates, isLoading } = useAutomationTemplates();

  if (isLoading) {
    return <div>Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Message Templates</h3>
          <p className="text-sm text-muted-foreground">Manage the content of your automated messages.</p>
        </div>
        <Button>Create Template</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates?.map((template) => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{template.name}</CardTitle>
                <Badge variant="secondary">{template.type}</Badge>
              </div>
              <CardDescription className="line-clamp-1">{template.subject || "No Subject"}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap line-clamp-4 h-24 overflow-hidden text-muted-foreground">
                {template.content}
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                <FileEdit className="mr-2 h-4 w-4" /> Edit Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
